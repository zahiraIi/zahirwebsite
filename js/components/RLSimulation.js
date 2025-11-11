/**
 * Swarm Navigation Simulation - Simple Learning Visualization
 * Educational visualization of robots learning to navigate with obstacle avoidance
 * Based on reinforcement learning principles (simplified for demonstration)
 */

let p5Instance = null;
let p5Loaded = false;

/**
 * Load p5.js from CDN if not already loaded
 */
function loadP5JS() {
  return new Promise((resolve) => {
    if (window.p5) {
      p5Loaded = true;
      resolve();
      return;
    }

    if (p5Loaded) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.0/p5.min.js';
    script.onload = () => {
      p5Loaded = true;
      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load p5.js');
      resolve();
    };
    document.head.appendChild(script);
  });
}

/**
 * Learning Robot - Simple agent with learning behavior
 */
class LearningRobot {
  constructor(x, y, worldWidth, worldHeight, p5Instance, startPoint = null, algorithm = 'DDPG') {
    this.position = p5Instance.createVector(x, y);
    this.velocity = p5Instance.createVector(0, 0);
    this.acceleration = p5Instance.createVector(0, 0);
    this.p = p5Instance;
    this.startPoint = startPoint ? p5Instance.createVector(startPoint.x, startPoint.y) : p5Instance.createVector(x, y);
    
    // Physics
    this.maxSpeed = 6.5; // Increased speed range: 5-8 (set to 6.5 for balanced performance)
    this.maxForce = 0.15;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    
    // Learning parameters (episode-based RL)
    this.episodeCount = 0;
    this.successCount = 0;
    this.episodeMetrics = []; // Track performance over episodes
    this.bestEpisodeTime = Infinity;
    this.bestEpisodeCollisions = Infinity;
    
    // Adaptive learning weights (improve over episodes)
    this.learningProgress = 0.0; // 0.0 = just started, 1.0 = well trained
    
    // Visual: spinning animation
    this.rotationAngle = 0;
    this.rotationSpeed = 0.1;
    
    // Boids algorithm parameters (from swarm_engine.py)
    this.neighborRadius = 50.0; // How far to look for neighbors
    this.separationRadius = 25.0; // Minimum distance to maintain from neighbors
    
    // Behavior weights (from swarm_engine.py)
    this.separationWeight = 2.0; // Avoid crowding neighbors
    this.alignmentWeight = 1.0;  // Align with neighbor velocities
    this.cohesionWeight = 1.0;   // Move toward neighbor center
    this.goalWeight = 2.5;        // Seek goal
    this.currentGoal = null; // Store current goal
    
    // Learned obstacle avoidance (learns from collisions)
    // Each obstacle is learned separately - Map: obstacleId -> { learnedWeight, x, y, radius, lastCollision, avoidances, collisions }
    this.collisionMemory = new Map(); // Track obstacle-specific learning
    this.hasNewKnowledge = false; // Flag for knowledge sharing
    
    // Reward-critic feedback: track obstacle avoidance performance
    this.totalAvoidances = 0; // Successful obstacle avoidances
    this.totalLearnedObstacles = 0; // Total obstacles learned about
    this.avoidanceSuccessRate = 0.0; // Rate of successful avoidances
    
    // Collective knowledge: path to target (shared from successful robots)
    this.hasPathKnowledge = false; // Knows path to target (from another robot)
    this.pathKnowledgeWeight = 0.0; // How much to follow the shared path (0-1)
    this.targetDirection = null; // General direction toward target (from successful robot)
    
    // DDPG-style policy: deterministic with exploration noise
    this.policyNoise = this.p.createVector(0, 0); // Ornstein-Uhlenbeck noise for exploration
    this.noiseTheta = 0.15; // OU noise parameter (mean reversion)
    this.noiseSigma = 0.2; // OU noise parameter (volatility)
    this.explorationNoise = 0.3; // Initial exploration noise scale (decreases with learning)
    
    // Status
    this.reachedGoal = false;
    this.hitObstacle = false; // Flag for obstacle collision
    this.collisionCount = 0;
    this.stepsSinceStart = 0;
    this.timeAtGoal = 0; // Time spent at goal (for stopping behavior)
    
    // Stuck detection
    this.positionHistory = [];
    this.maxHistorySize = 30;
    this.stuckThreshold = 5; // pixels - if moved less than this in last N frames, consider stuck
    this.isStuck = false;
    this.stuckEscapeAngle = this.p.random(0, this.p.TWO_PI); // Random direction to try when stuck
    
    // Particle trail system (NASA/NVIDIA style visualization)
    this.trail = []; // Array of {x, y, alpha, age}
    this.maxTrailLength = 80; // Maximum trail points
    this.trailDecayRate = 0.95; // Alpha decay per frame
    
    // Particle effects for collisions/success
    this.particles = []; // Array of particle objects
    this.maxParticles = 20;
    
    // Improved physics (momentum, smoother movement)
    this.momentum = 0.85; // Momentum factor (0-1, higher = more momentum)
    this.smoothAcceleration = this.p.createVector(0, 0);
    this.accelerationSmoothing = 0.3; // Smoothing factor for acceleration
    
    // RL Algorithm type (DDPG, TD3, SAC, PPO)
    this.algorithm = algorithm;
    
    // Algorithm-specific parameters
    this.initAlgorithmParams();
  }
  
  /**
   * Initialize algorithm-specific parameters
   * Based on: https://github.com/reiniscimurs/DRL-robot-navigation-IR-SIM
   */
  initAlgorithmParams() {
    switch (this.algorithm) {
      case 'DDPG':
        // Deep Deterministic Policy Gradient: Deterministic policy with OU noise
        this.explorationNoise = 0.3;
        this.noiseTheta = 0.15;
        this.noiseSigma = 0.2;
        this.learningRate = 0.001;
        this.policyUpdateDelay = 1; // Update every step
        this.clipNoise = false;
        this.entropyBonus = 0; // No entropy
        break;
        
      case 'TD3':
        // Twin Delayed DDPG: More stable, delayed updates, clipped noise
        this.explorationNoise = 0.2; // Lower noise than DDPG
        this.noiseTheta = 0.15;
        this.noiseSigma = 0.15; // Lower sigma
        this.learningRate = 0.001;
        this.policyUpdateDelay = 2; // Delayed updates (TD3 characteristic)
        this.clipNoise = true; // Clipped noise (TD3 characteristic)
        this.clipRange = 0.5;
        this.entropyBonus = 0;
        break;
        
      case 'SAC':
        // Soft Actor-Critic: High exploration with entropy bonus
        this.explorationNoise = 0.4; // Higher exploration
        this.noiseTheta = 0.1; // Faster mean reversion
        this.noiseSigma = 0.3; // Higher volatility
        this.learningRate = 0.0003;
        this.policyUpdateDelay = 1;
        this.clipNoise = false;
        this.entropyBonus = 0.2; // Entropy bonus for exploration (SAC characteristic)
        this.entropyAlpha = 0.2; // Entropy coefficient
        break;
        
      case 'PPO':
        // Proximal Policy Optimization: Conservative updates, on-policy
        this.explorationNoise = 0.25;
        this.noiseTheta = 0.2;
        this.noiseSigma = 0.15;
        this.learningRate = 0.0003;
        this.policyUpdateDelay = 1;
        this.clipNoise = false;
        this.entropyBonus = 0.01; // Small entropy
        this.clipRatio = 0.2; // PPO clipping ratio
        this.ppoEpochs = 4; // Multiple updates per batch
        break;
        
      default:
        // Default to DDPG
        this.explorationNoise = 0.3;
        this.noiseTheta = 0.15;
        this.noiseSigma = 0.2;
        this.learningRate = 0.001;
        this.policyUpdateDelay = 1;
        this.clipNoise = false;
        this.entropyBonus = 0;
    }
    
    // Track policy update steps for delayed updates (TD3)
    this.policyUpdateCounter = 0;
  }
  
  /**
   * SEPARATION: Avoid crowding neighbors (from swarm_engine.py _separation)
   */
  separation(robots) {
    const steer = this.p.createVector(0, 0);
    let count = 0;
    
    for (let robot of robots) {
      if (robot === this) continue;
      
      const diff = this.p.createVector(
        this.position.x - robot.position.x,
        this.position.y - robot.position.y
      );
      const distance = diff.mag();
      
      if (distance > 0 && distance < this.separationRadius) {
        diff.normalize();
        diff.div(distance); // Weight by inverse distance
        steer.add(diff);
        count++;
      }
    }
    
    if (count > 0) {
      steer.div(count);
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
    }
    
    return steer;
  }
  
  /**
   * ALIGNMENT: Steer towards average heading of neighbors (from swarm_engine.py _alignment)
   */
  alignment(robots) {
    const avgVelocity = this.p.createVector(0, 0);
    let count = 0;
    
    for (let robot of robots) {
      if (robot === this) continue;
      
      const diff = this.p.createVector(
        this.position.x - robot.position.x,
        this.position.y - robot.position.y
      );
      const distance = diff.mag();
      
      if (distance > 0 && distance < this.neighborRadius) {
        avgVelocity.add(robot.velocity);
        count++;
      }
    }
    
    if (count > 0) {
      avgVelocity.div(count);
      avgVelocity.normalize();
      avgVelocity.mult(this.maxSpeed);
      
      const steer = this.p.createVector(
        avgVelocity.x - this.velocity.x,
        avgVelocity.y - this.velocity.y
      );
      steer.limit(this.maxForce);
      return steer;
    }
    
    return this.p.createVector(0, 0);
  }
  
  /**
   * COHESION: Steer towards center of neighbors (from swarm_engine.py _cohesion)
   */
  cohesion(robots) {
    const centerOfMass = this.p.createVector(0, 0);
    let count = 0;
    
    for (let robot of robots) {
      if (robot === this) continue;
      
      const diff = this.p.createVector(
        this.position.x - robot.position.x,
        this.position.y - robot.position.y
      );
      const distance = diff.mag();
      
      if (distance > 0 && distance < this.neighborRadius) {
        centerOfMass.add(robot.position);
        count++;
      }
    }
    
    if (count > 0) {
      centerOfMass.div(count);
      const desired = this.p.createVector(
        centerOfMass.x - this.position.x,
        centerOfMass.y - this.position.y
      );
      desired.normalize();
      desired.mult(this.maxSpeed);
      
      const steer = this.p.createVector(
        desired.x - this.velocity.x,
        desired.y - this.velocity.y
      );
      steer.limit(this.maxForce);
      return steer;
    }
    
    return this.p.createVector(0, 0);
  }
  
  /**
   * DDPG-style deterministic policy: computes action based on state
   * Returns deterministic action (steering force) for given state
   */
  computePolicy(state) {
    // State: [relative position to goal, relative position to obstacles, velocity, path knowledge]
    const toGoal = state.toGoal;
    const hasObstacles = state.hasObstacles;
    const currentVel = state.velocity;
    const hasPathKnowledge = this.hasPathKnowledge && this.targetDirection;
    
    // Deterministic policy: always computes same action for same state
    // Base policy: seek goal with learned weights
    let policyAction = toGoal.copy();
    
    // If robot has path knowledge from successful robot, bias toward that path
    if (hasPathKnowledge) {
      // Blend goal direction with shared path knowledge
      const pathInfluence = this.pathKnowledgeWeight * 0.3; // 30% influence from path knowledge
      policyAction = this.p.createVector(
        toGoal.x * (1 - pathInfluence) + this.targetDirection.x * pathInfluence,
        toGoal.y * (1 - pathInfluence) + this.targetDirection.y * pathInfluence
      );
    }
    
    policyAction.normalize();
    
    // Adjust based on learned behavior weights (from learning progress)
    // Policy improves over time: more confident goal-seeking as learning progresses
    let goalInfluence = this.goalWeight * (1.0 + this.learningProgress * 0.5);
    
    // If obstacles nearby, policy accounts for them (learned behavior)
    if (hasObstacles) {
      // Policy learned to reduce goal-seeking when near obstacles
      // This is part of the learned policy, not preset avoidance
      const obstacleAdjustment = 1.0 - (this.learningProgress * 0.3);
      goalInfluence *= obstacleAdjustment;
    }
    
    policyAction.mult(goalInfluence);
    policyAction.limit(this.maxForce);
    
    return policyAction;
  }
  
  /**
   * Ornstein-Uhlenbeck noise process (DDPG/TD3 exploration)
   * Generates smooth, temporally correlated exploration noise
   * For SAC/PPO, uses different noise models
   */
  updateExplorationNoise() {
    if (this.algorithm === 'SAC') {
      // SAC: Higher variance Gaussian noise with entropy
      this.policyNoise.x = this.p.randomGaussian(0, this.noiseSigma);
      this.policyNoise.y = this.p.randomGaussian(0, this.noiseSigma);
      this.policyNoise.limit(this.explorationNoise * 1.5); // More exploration
    } else if (this.algorithm === 'PPO') {
      // PPO: Gaussian noise with clipping
      this.policyNoise.x = this.p.randomGaussian(0, this.noiseSigma);
      this.policyNoise.y = this.p.randomGaussian(0, this.noiseSigma);
      this.policyNoise.limit(this.explorationNoise);
    } else {
      // DDPG/TD3: Ornstein-Uhlenbeck process
      const mu = 0; // Mean (centered at zero)
      const dt = 1.0; // Time step
      
      // Update noise (mean-reverting random walk)
      this.policyNoise.x += this.noiseTheta * (mu - this.policyNoise.x) * dt + 
                            this.noiseSigma * this.p.randomGaussian(0, 1);
      this.policyNoise.y += this.noiseTheta * (mu - this.policyNoise.y) * dt + 
                            this.noiseSigma * this.p.randomGaussian(0, 1);
      
      // TD3: Clip noise
      if (this.clipNoise) {
        this.policyNoise.x = this.p.constrain(this.policyNoise.x, -this.clipRange, this.clipRange);
        this.policyNoise.y = this.p.constrain(this.policyNoise.y, -this.clipRange, this.clipRange);
      }
      
      // Limit noise magnitude
      this.policyNoise.limit(this.explorationNoise);
    }
  }
  
  /**
   * DDPG-style action: deterministic policy + exploration noise
   */
  ddpgAction(target, obstacles) {
    if (!target) return this.p.createVector(0, 0);
    
    // Calculate state
    const toGoal = this.p.createVector(
      target.x - this.position.x,
      target.y - this.position.y
    );
    
    // Check if obstacles are nearby (state feature)
    const hasObstacles = obstacles.some(obs => {
      const dist = this.p.dist(this.position.x, this.position.y, obs.x, obs.y);
      return dist < obs.radius + 50;
    });
    
    // Normalize toGoal for policy
    const toGoalNorm = toGoal.copy();
    const distToGoal = toGoalNorm.mag();
    if (distToGoal > 0) {
      toGoalNorm.normalize();
    }
    
    const state = {
      toGoal: toGoalNorm,
      hasObstacles: hasObstacles,
      velocity: this.velocity.copy()
    };
    
    // Compute deterministic policy action
    const deterministicAction = this.computePolicy(state);
    
    // Algorithm-specific policy updates (TD3 has delayed updates)
    this.policyUpdateCounter++;
    const shouldUpdatePolicy = (this.policyUpdateCounter % this.policyUpdateDelay === 0);
    
    // Update exploration noise (algorithm-specific)
    this.updateExplorationNoise();
    
    // Add exploration noise to deterministic action (algorithm-specific scaling)
    let explorationScale = this.explorationNoise * (1.0 - this.learningProgress);
    
    // SAC: Higher exploration, entropy bonus
    if (this.algorithm === 'SAC') {
      explorationScale *= (1.0 + this.entropyBonus); // Boost exploration
    }
    
    // PPO: Conservative exploration, decreases faster
    if (this.algorithm === 'PPO') {
      explorationScale *= 0.8; // More conservative
    }
    
    // TD3: Only add noise if policy should update (delayed)
    if (this.algorithm === 'TD3' && !shouldUpdatePolicy) {
      explorationScale *= 0.3; // Reduced noise on non-update steps
    }
    
    const noisyAction = this.p.createVector(
      deterministicAction.x + this.policyNoise.x * explorationScale,
      deterministicAction.y + this.policyNoise.y * explorationScale
    );
    
    // Convert to steering force
    const desired = noisyAction.copy();
    desired.normalize();
    desired.mult(this.maxSpeed);
    
    const steer = this.p.createVector(
      desired.x - this.velocity.x,
      desired.y - this.velocity.y
    );
    steer.limit(this.maxForce);
    
    return steer;
  }
  
  /**
   * Seek the target destination (using DDPG policy)
   */
  seek(target, obstacles = []) {
    if (!target) return this.p.createVector(0, 0);
    
    const distance = this.p.dist(
      this.position.x, this.position.y,
      target.x, target.y
    );
    
      if (distance < 15) {
        // Reached goal! Stop at target
        if (!this.reachedGoal) {
          this.reachedGoal = true;
          this.successCount++;
          this.episodeCount++;
          this.timeAtGoal = 0;
          
          // Create success particle effect (green/cyan) - NASA/NVIDIA style
          this.createParticleEffect(this.position.x, this.position.y, [100, 255, 200], 12);
          
          // Record episode metrics for learning
          const episodeTime = this.stepsSinceStart;
        const episodeCollisions = this.collisionCount;
        
        // Store episode data
        this.episodeMetrics.push({
          time: episodeTime,
          collisions: episodeCollisions,
          success: true
        });
        
        // Keep only last 10 episodes for learning
        if (this.episodeMetrics.length > 10) {
          this.episodeMetrics.shift();
        }
        
        // Update best performance
        if (episodeTime < this.bestEpisodeTime) {
          this.bestEpisodeTime = episodeTime;
        }
        if (episodeCollisions < this.bestEpisodeCollisions) {
          this.bestEpisodeCollisions = episodeCollisions;
        }
        
        // Learning progress is now primarily based on obstacle avoidance (reward-critic feedback)
        // Update it based on current avoidance performance
        this.updateAvoidanceMetrics();
        
        // Also factor in target-reaching success for overall learning
        if (this.episodeMetrics.length >= 1) {
          const recentSuccesses = this.episodeMetrics.filter(m => m.success).length;
          const targetSuccessRate = recentSuccesses / this.episodeMetrics.length;
          
          // Combine obstacle avoidance (70%) with target success (30%)
          const obstacleLearning = this.learningProgress;
          this.learningProgress = Math.min(1.0,
            obstacleLearning * 0.7 + // 70% from obstacle avoidance
            targetSuccessRate * 0.3   // 30% from reaching target
          );
        }
        
        // On successful episode, retain obstacle-specific knowledge (but reduce it slightly)
        // This allows robots to remember specific obstacle locations between episodes
        for (let [obstacleId, obstacleKnowledge] of this.collisionMemory.entries()) {
          obstacleKnowledge.learnedWeight = Math.max(0.5, obstacleKnowledge.learnedWeight * 0.8);
        }
        
        // Apply learning: improve behavior weights based on progress
        this.applyLearning();
        
        // Mark that this robot has knowledge to share (path to target)
        this.hasNewKnowledge = true;
        // Store path knowledge (direction to target from start)
        this.targetDirection = this.p.createVector(
          target.x - this.startPoint.x,
          target.y - this.startPoint.y
        );
        this.targetDirection.normalize();
        this.hasPathKnowledge = true; // This robot knows the path
        this.pathKnowledgeWeight = 1.0; // Full confidence in its path
        
        // Reduce exploration noise after success (DDPG learning)
        this.explorationNoise = Math.max(0.05, this.explorationNoise * 0.9);
      }
      
      // Stop at target - don't move
      this.timeAtGoal++;
      this.velocity.mult(0);
      this.acceleration.mult(0);
      return this.p.createVector(0, 0);
    }
    
    // Use DDPG-style deterministic policy with exploration noise
    // Policy is deterministic (same state → same action), but noise is added for exploration
    return this.ddpgAction(target, obstacles);
  }
  
  /**
   * Check for collision with obstacles (runs for all robots, regardless of learned weight)
   */
  checkCollision(obstacles) {
    for (let obs of obstacles) {
      const obsPos = this.p.createVector(obs.x, obs.y);
      const distance = this.p.dist(
        this.position.x, this.position.y,
        obs.x, obs.y
      );
      
      // Check collision (from Python: distance < radius + 5)
      // Also check robot radius (14 pixels / 2 = 7)
      const robotRadius = 7;
      if (distance < obs.radius + robotRadius) {
        // Mark that we hit an obstacle - will reset to origin
        this.hitObstacle = true;
        this.collisionCount++;
        
        // Learn from THIS SPECIFIC OBSTACLE (not all obstacles)
        // Each obstacle is learned separately
        const obstacleId = obs.id;
        let obstacleKnowledge = this.collisionMemory.get(obstacleId);
        
        if (!obstacleKnowledge) {
          // First time hitting this obstacle - initialize learning
          obstacleKnowledge = {
            learnedWeight: 0.5, // Start with some learning
            x: obs.x,
            y: obs.y,
            radius: obs.radius,
            lastCollision: this.stepsSinceStart,
            avoidances: 0, // Track successful avoidances
            collisions: 1 // Track collisions
          };
          this.totalLearnedObstacles++;
        } else {
          // Update existing knowledge for this obstacle
          obstacleKnowledge.learnedWeight = Math.min(3.0, obstacleKnowledge.learnedWeight + 0.5);
          obstacleKnowledge.lastCollision = this.stepsSinceStart;
          obstacleKnowledge.collisions = (obstacleKnowledge.collisions || 0) + 1;
          // Update position in case obstacle moved
          obstacleKnowledge.x = obs.x;
          obstacleKnowledge.y = obs.y;
          obstacleKnowledge.radius = obs.radius;
        }
        
        // Store obstacle-specific knowledge
        this.collisionMemory.set(obstacleId, obstacleKnowledge);
        
        // Update avoidance success rate (penalty for collision)
        this.updateAvoidanceMetrics();
        
        // Keep memory size manageable (max 20 obstacles)
        if (this.collisionMemory.size > 20) {
          // Remove oldest (based on lastCollision)
          const entries = Array.from(this.collisionMemory.entries());
          entries.sort((a, b) => a[1].lastCollision - b[1].lastCollision);
          this.collisionMemory.delete(entries[0][0]);
        }
        
        return true; // Collision detected
      }
    }
    return false; // No collision
  }
  
  /**
   * Learned obstacle avoidance (from swarm_engine.py _avoid_obstacles)
   * Robots learn to avoid SPECIFIC obstacles after hitting them
   * Only avoids obstacles the robot has actually encountered
   * Rewards robots for successfully avoiding obstacles
   */
  learnedAvoidObstacles(obstacles) {
    // Only apply avoidance for obstacles we've learned about
    if (this.collisionMemory.size === 0) {
      return this.p.createVector(0, 0);
    }
    
    const steer = this.p.createVector(0, 0);
    let successfulAvoidances = 0;
    
    for (let obs of obstacles) {
      // Only avoid obstacles we've hit before (learned about)
      const obstacleId = obs.id;
      const obstacleKnowledge = this.collisionMemory.get(obstacleId);
      
      if (!obstacleKnowledge || obstacleKnowledge.learnedWeight <= 0) {
        // Haven't learned about this obstacle yet - don't avoid it
        continue;
      }
      
      const obsPos = this.p.createVector(obs.x, obs.y);
      const diff = this.p.createVector(
        this.position.x - obsPos.x,
        this.position.y - obsPos.y
      );
      const distance = diff.mag();
      
      // Calculate avoidance distance based on learning level for THIS obstacle
      const baseAvoidanceDistance = 50;
      const learnedAvoidanceDistance = baseAvoidanceDistance + (obstacleKnowledge.learnedWeight * 30); // 50 to 140
      
      // Check if we're in avoidance range but not colliding (successful avoidance)
      const avoidanceRange = obs.radius + learnedAvoidanceDistance;
      const collisionRange = obs.radius + 7; // Robot radius
      
      if (distance < avoidanceRange && distance > collisionRange) {
        // Successfully avoiding this obstacle - REWARD
        diff.normalize();
        
        // Stronger force when closer, and stronger overall when more learned
        const forceMagnitude = Math.max(0, (avoidanceRange - distance) / learnedAvoidanceDistance);
        // Multiply by learned weight for THIS obstacle to make avoidance stronger
        const adjustedForce = forceMagnitude * (1.0 + obstacleKnowledge.learnedWeight * 0.5);
        diff.mult(adjustedForce);
        steer.add(diff);
        
        // Track successful avoidance (reward-critic feedback)
        successfulAvoidances++;
        
        // Occasionally reward the robot for avoiding (increase learned weight slightly)
        if (this.p.random() < 0.01) { // 1% chance per frame when avoiding
          obstacleKnowledge.avoidances = (obstacleKnowledge.avoidances || 0) + 1;
          // Increase learned weight slightly for good avoidance
          obstacleKnowledge.learnedWeight = Math.min(3.0, obstacleKnowledge.learnedWeight + 0.02);
        }
      }
    }
    
    // Reward successful obstacle avoidances
    if (successfulAvoidances > 0) {
      this.totalAvoidances += successfulAvoidances;
      this.updateAvoidanceMetrics();
    }
    
    // Limit force (from Python: max_force * 2)
    steer.limit(this.maxForce * 2);
    
    // Apply average learned weight across all known obstacles
    const avgLearnedWeight = Array.from(this.collisionMemory.values())
      .reduce((sum, k) => sum + k.learnedWeight, 0) / this.collisionMemory.size;
    steer.mult(Math.min(1.0, avgLearnedWeight)); // Cap at 1.0 to prevent over-compensation
    
    return steer;
  }
  
  /**
   * Update avoidance metrics based on reward-critic feedback
   * Learning progress increases as robots successfully avoid obstacles
   */
  updateAvoidanceMetrics() {
    if (this.collisionMemory.size === 0) {
      this.avoidanceSuccessRate = 0.0;
      return;
    }
    
    // Calculate success rate for each learned obstacle
    let totalAvoidances = 0;
    let totalInteractions = 0;
    
    for (let [obstacleId, obstacleKnowledge] of this.collisionMemory.entries()) {
      const avoidances = obstacleKnowledge.avoidances || 0;
      const collisions = obstacleKnowledge.collisions || 0;
      totalAvoidances += avoidances;
      totalInteractions += avoidances + collisions;
    }
    
    // Calculate overall avoidance success rate
    if (totalInteractions > 0) {
      this.avoidanceSuccessRate = totalAvoidances / totalInteractions;
    } else {
      this.avoidanceSuccessRate = 0.0;
    }
    
    // Update learning progress based on obstacle avoidance performance
    // Higher avoidance rate = higher learning progress
    const avgLearnedWeight = Array.from(this.collisionMemory.values())
      .reduce((sum, k) => sum + k.learnedWeight, 0) / this.collisionMemory.size;
    
    // Learning progress: combination of avoidance success rate and learned weight
    this.learningProgress = Math.min(1.0,
      this.avoidanceSuccessRate * 0.6 + // 60% based on avoidance success
      (avgLearnedWeight / 3.0) * 0.4   // 40% based on how much they've learned
    );
  }
  
  /**
   * Check if robot is stuck (not moving)
   */
  checkIfStuck() {
    // Track position history
    this.positionHistory.push(this.position.copy());
    if (this.positionHistory.length > this.maxHistorySize) {
      this.positionHistory.shift();
    }
    
    // Check if moved enough in recent frames
    if (this.positionHistory.length >= this.maxHistorySize) {
      const oldestPos = this.positionHistory[0];
      const distanceMoved = this.p.dist(
        oldestPos.x, oldestPos.y,
        this.position.x, this.position.y
      );
      
      this.isStuck = distanceMoved < this.stuckThreshold;
      
      if (this.isStuck) {
        // Try a new escape direction
        this.stuckEscapeAngle = this.p.random(0, this.p.TWO_PI);
        // Increase exploration to help escape
        this.explorationRate = Math.min(0.7, this.explorationRate + 0.1);
      }
    } else {
      this.isStuck = false;
    }
  }
  
  /**
   * Apply learning from episodes - improve behavior weights
   */
  applyLearning() {
    // As robots learn, they become more goal-focused and efficient
    // Goal seeking becomes more important (learn to navigate directly)
    this.goalWeight = 2.5 + (this.learningProgress * 1.5); // 2.5 to 4.0
    
    // Cohesion improves (learn to work together better)
    this.cohesionWeight = 1.0 + (this.learningProgress * 0.5); // 1.0 to 1.5
    
    // Separation becomes more refined (learn optimal spacing)
    this.separationWeight = 2.0 - (this.learningProgress * 0.3); // 2.0 to 1.7 (less aggressive)
    
    // Learned obstacle avoidance improves with experience (but not preset)
    // The learnedObstacleWeight is managed by collisions, not here
  }
  
  /**
   * Get escape force when stuck
   */
  getStuckEscapeForce() {
    if (!this.isStuck) return this.p.createVector(0, 0);
    
    // Strong force in escape direction
    const escape = this.p.createVector(
      this.p.cos(this.stuckEscapeAngle),
      this.p.sin(this.stuckEscapeAngle)
    );
    escape.mult(this.maxForce * 2);
    return escape;
  }
  
  /**
   * Update robot position using Boids algorithm (from swarm_engine.py)
   */
  update(robots, obstacles, goal) {
    // Store goal for obstacle avoidance calculations
    this.currentGoal = goal;
    
      // Check for collision BEFORE moving (for all robots, regardless of learned weight)
      const hasCollision = this.checkCollision(obstacles);
      
      // If collision detected, don't move - will be reset in next frame
      if (hasCollision) {
        // Create collision particle effect (red/orange)
        this.createParticleEffect(this.position.x, this.position.y, [255, 100, 50], 8);
        // Stop movement immediately
        this.velocity.mult(0);
        this.acceleration.mult(0);
        return; // Exit early, don't update position
      }
    
    // Check if stuck
    this.checkIfStuck();
    
    // Reset acceleration
    this.acceleration.mult(0);
    
    // Boids algorithm: separation, alignment, cohesion (from swarm_engine.py)
    const separationForce = this.separation(robots);
    const alignmentForce = this.alignment(robots);
    const cohesionForce = this.cohesion(robots);
    
    // Apply boids forces with weights (from swarm_engine.py update method)
    const sep = separationForce.copy();
    sep.mult(this.separationWeight); // 2.0
    this.acceleration.add(sep);
    
    const align = alignmentForce.copy();
    align.mult(this.alignmentWeight); // 1.0
    this.acceleration.add(align);
    
    const coh = cohesionForce.copy();
    coh.mult(this.cohesionWeight); // 1.0
    this.acceleration.add(coh);
    
    // Learned obstacle avoidance (only if robot has learned it from collisions)
    // This becomes stronger as robots learn from collisions
    // Rewards robots for successfully avoiding obstacles
    const learnedObstacleForce = this.learnedAvoidObstacles(obstacles);
    this.acceleration.add(learnedObstacleForce);
    
    // Continuously update learning progress based on obstacle avoidance (reward-critic feedback)
    // Update every few frames to avoid performance issues
    if (this.stepsSinceStart % 10 === 0) {
      this.updateAvoidanceMetrics();
    }
    
    // Goal seeking (additional to boids for navigation)
    // Uses DDPG-style deterministic policy with exploration noise
    // Reduce goal weight when approaching learned obstacles (prioritize avoidance)
    const goalForce = this.seek(goal, obstacles);
    let goalWeight = this.isStuck ? this.goalWeight * 0.5 : this.goalWeight;
    
    // If robot has path knowledge from successful robot, increase goal-seeking confidence
    if (this.hasPathKnowledge && this.pathKnowledgeWeight > 0) {
      goalWeight *= (1.0 + this.pathKnowledgeWeight * 0.3); // Up to 30% increase
    }
    
    // If robot has learned avoidance and is near KNOWN obstacles, reduce goal seeking
    // This helps robots prioritize avoiding obstacles they've learned about
    if (this.collisionMemory.size > 0) {
      let nearestKnownObstacleDist = Infinity;
      
      // Only check obstacles the robot has learned about
      for (let obs of obstacles) {
        const obstacleKnowledge = this.collisionMemory.get(obs.id);
        if (obstacleKnowledge) {
          const dist = this.p.dist(this.position.x, this.position.y, obs.x, obs.y);
          nearestKnownObstacleDist = Math.min(nearestKnownObstacleDist, dist);
        }
      }
      
      // If close to any KNOWN obstacle, reduce goal seeking to prioritize avoidance
      if (nearestKnownObstacleDist < 100) {
        const avgLearnedWeight = Array.from(this.collisionMemory.values())
          .reduce((sum, k) => sum + k.learnedWeight, 0) / this.collisionMemory.size;
        goalWeight *= (1.0 - Math.min(0.6, avgLearnedWeight * 0.2)); // Reduce goal seeking by up to 60%
      }
    }
    
    const goalVec = goalForce.copy();
    goalVec.mult(goalWeight);
    this.acceleration.add(goalVec);
    
    // Escape force when stuck
    if (this.isStuck) {
      const escapeForce = this.getStuckEscapeForce();
      this.acceleration.add(escapeForce);
    }
    
    // Update physics with momentum and smoothing (modern quartr.com style - smooth, fluid)
    // Smooth acceleration changes for more fluid movement (easing function)
    const smoothing = this.accelerationSmoothing;
    this.smoothAcceleration.lerp(this.acceleration, smoothing);
    
    // Apply momentum to velocity (more realistic physics - robots have inertia)
    // Use smooth easing for velocity (quartr.com style)
    this.velocity.mult(this.momentum);
    this.velocity.add(this.smoothAcceleration);
    this.velocity.limit(this.maxSpeed);
    
    // Smooth position updates for fluid animation (quartr.com style)
    // This creates the smooth, modern animation feel
    
    // Minimum velocity to prevent getting completely stuck
    if (this.velocity.mag() < 0.1 && !this.reachedGoal) {
      // Give a small push in a random direction
      const push = this.p.createVector(
        this.p.random(-1, 1),
        this.p.random(-1, 1)
      );
      push.normalize();
      push.mult(this.maxSpeed * 0.3);
      this.velocity.add(push);
    }
    
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    
    // Update particle trail (NASA/NVIDIA style path visualization)
    this.updateTrail();
    
    // Update rotation (spinning animation)
    this.rotationAngle += this.rotationSpeed;
    
    // Keep in bounds (simple wrapping)
    if (this.position.x < 0) this.position.x = this.worldWidth;
    if (this.position.x > this.worldWidth) this.position.x = 0;
    if (this.position.y < 0) this.position.y = this.worldHeight;
    if (this.position.y > this.worldHeight) this.position.y = 0;
    
    this.stepsSinceStart++;
  }
  
  /**
   * Share knowledge with another robot (transfer obstacle-specific learned avoidance AND path knowledge)
   */
  shareKnowledge(targetRobot, targetPoint) {
    if (targetRobot === this) return; // Don't share with self
    
    const knowledgeTransferRate = 0.3; // How much knowledge transfers (30%)
    
    // Share obstacle-specific knowledge
    for (let [obstacleId, obstacleKnowledge] of this.collisionMemory.entries()) {
      const targetKnowledge = targetRobot.collisionMemory.get(obstacleId);
      
      if (!targetKnowledge) {
        // Target robot doesn't know about this obstacle - share knowledge
        targetRobot.collisionMemory.set(obstacleId, {
          learnedWeight: obstacleKnowledge.learnedWeight * knowledgeTransferRate, // Transfer 30% of knowledge
          x: obstacleKnowledge.x,
          y: obstacleKnowledge.y,
          radius: obstacleKnowledge.radius,
          lastCollision: obstacleKnowledge.lastCollision,
          avoidances: 0,
          collisions: 0
        });
      } else {
        // Target robot already knows about this obstacle - merge knowledge
        // Average the learned weights (with transfer rate)
        const newWeight = targetKnowledge.learnedWeight * (1 - knowledgeTransferRate) + 
                         obstacleKnowledge.learnedWeight * knowledgeTransferRate;
        targetKnowledge.learnedWeight = Math.min(3.0, Math.max(targetKnowledge.learnedWeight, newWeight));
        targetRobot.collisionMemory.set(obstacleId, targetKnowledge);
      }
    }
    
    // Share path knowledge (collective knowledge - how to reach target)
    if (this.hasPathKnowledge && this.targetDirection) {
      // Share the path direction knowledge
      targetRobot.hasPathKnowledge = true;
      targetRobot.pathKnowledgeWeight = Math.max(targetRobot.pathKnowledgeWeight, this.pathKnowledgeWeight * knowledgeTransferRate);
      
      // If target robot doesn't have path knowledge, give it the direction
      if (!targetRobot.targetDirection) {
        targetRobot.targetDirection = this.targetDirection.copy();
      } else {
        // Blend path directions
        const blended = this.p.createVector(
          targetRobot.targetDirection.x * 0.7 + this.targetDirection.x * 0.3,
          targetRobot.targetDirection.y * 0.7 + this.targetDirection.y * 0.3
        );
        blended.normalize();
        targetRobot.targetDirection = blended;
      }
      
      // Reduce exploration noise since we now have path knowledge (DDPG learning)
      targetRobot.explorationNoise = Math.max(0.05, targetRobot.explorationNoise * 0.8);
    }
    
    // Keep memory size manageable (max 20 obstacles)
    if (targetRobot.collisionMemory.size > 20) {
      // Remove oldest (based on lastCollision)
      const entries = Array.from(targetRobot.collisionMemory.entries());
      entries.sort((a, b) => a[1].lastCollision - b[1].lastCollision);
      targetRobot.collisionMemory.delete(entries[0][0]);
    }
  }
  
  /**
   * Reset robot to start position (called when target is reached or obstacle hit)
   */
  reset(startPoint, reason = 'goal') {
    this.position.x = startPoint.x + this.p.random(-10, 10);
    this.position.y = startPoint.y + this.p.random(-10, 10);
    this.velocity.mult(0);
    this.acceleration.mult(0);
    this.reachedGoal = false;
    this.hitObstacle = false;
    this.timeAtGoal = 0;
    this.stepsSinceStart = 0;
      this.positionHistory = [];
      this.isStuck = false;
      this.stuckEscapeAngle = this.p.random(0, this.p.TWO_PI);
      this.hasNewKnowledge = false;
      
      // Clear trail on reset (keep some history for smooth transition)
      if (reason === 'obstacle') {
        // Keep some trail history when resetting due to collision
        this.trail = this.trail.slice(-20); // Keep last 20 points
      } else {
        // Clear trail completely on goal reset
        this.trail = [];
      }
      
      // Clear particles
      this.particles = [];
      
      // Reset DDPG exploration noise
      this.policyNoise.mult(0);
    
    // Keep path knowledge but reduce confidence slightly
    if (this.hasPathKnowledge) {
      this.pathKnowledgeWeight = Math.max(0.3, this.pathKnowledgeWeight * 0.9);
    }
    
    // Slightly reduce exploration noise after each episode (learning)
    this.explorationNoise = Math.max(0.05, this.explorationNoise * 0.95);
    
    if (reason === 'goal') {
      // Reset collision count for new episode (successful)
      this.collisionCount = 0;
      // Keep obstacle-specific knowledge (robots remember specific obstacles between episodes)
      // But reduce learned weights slightly to allow adaptation to new obstacle positions
      for (let [obstacleId, obstacleKnowledge] of this.collisionMemory.entries()) {
        obstacleKnowledge.learnedWeight = Math.max(0, obstacleKnowledge.learnedWeight * 0.7);
      }
    } else if (reason === 'obstacle') {
      // Don't reset collision count - keep it for tracking
      // Keep obstacle-specific knowledge (already updated in checkCollision)
      // Keep collision memory so robot remembers which specific obstacles it has encountered
      // This allows robot to use stored logic to avoid those specific obstacles on next attempt
      // Update avoidance metrics after reset
      this.updateAvoidanceMetrics();
    }
  }
  
  /**
   * Update particle trail (NASA/NVIDIA style path visualization)
   */
  updateTrail() {
    // Add current position to trail
    this.trail.push({
      x: this.position.x,
      y: this.position.y,
      alpha: 255,
      age: 0
    });
    
    // Limit trail length
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
    
    // Update trail particles (fade and age)
    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].alpha *= this.trailDecayRate;
      this.trail[i].age++;
      
      // Remove very faded particles
      if (this.trail[i].alpha < 5) {
        this.trail.splice(i, 1);
      }
    }
  }
  
  /**
   * Create particle effect (for collisions, success, etc.)
   */
  createParticleEffect(x, y, color, count = 5) {
    for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
      this.particles.push({
        x: x + this.p.random(-5, 5),
        y: y + this.p.random(-5, 5),
        vx: this.p.random(-2, 2),
        vy: this.p.random(-2, 2),
        life: 1.0,
        decay: this.p.random(0.02, 0.05),
        size: this.p.random(2, 4),
        color: color
      });
    }
  }
  
  /**
   * Update particle effects
   */
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.vx *= 0.95; // Friction
      p.vy *= 0.95;
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  /**
   * Draw particle trail (modern quartr.com style - smooth, fluid)
   */
  drawTrail() {
    if (this.trail.length < 2) return;
    
    this.p.push();
    this.p.noFill();
    
    // Algorithm-specific colors
    let algorithmColor = { r: 100, g: 200, b: 255 }; // Default blue
    switch (this.algorithm) {
      case 'DDPG':
        algorithmColor = { r: 100, g: 200, b: 255 }; // Cyan-blue
        break;
      case 'TD3':
        algorithmColor = { r: 150, g: 100, b: 255 }; // Purple
        break;
      case 'SAC':
        algorithmColor = { r: 100, g: 255, b: 150 }; // Green-cyan
        break;
      case 'PPO':
        algorithmColor = { r: 255, g: 150, b: 100 }; // Orange
        break;
    }
    
    // Draw trail as connected line segments with smooth gradient (quartr.com style)
    for (let i = 1; i < this.trail.length; i++) {
      const prev = this.trail[i - 1];
      const curr = this.trail[i];
      
      // Smooth color interpolation based on trail position (modern animation)
      const trailProgress = i / this.trail.length;
      const brightness = this.p.map(trailProgress, 0, 1, 0.5, 1.0); // Fade from dim to bright
      
      // Algorithm color with learning progress and trail position
      const r = algorithmColor.r * brightness * (0.7 + this.learningProgress * 0.3);
      const g = algorithmColor.g * brightness * (0.7 + this.learningProgress * 0.3);
      const b = algorithmColor.b * brightness * (0.7 + this.learningProgress * 0.3);
      
      // Alpha based on trail age and learning progress (smooth fade)
      const alpha = prev.alpha * (0.2 + this.learningProgress * 0.5);
      
      this.p.stroke(r, g, b, alpha);
      // Smooth stroke weight (quartr.com style - fluid lines)
      this.p.strokeWeight(1.5 + this.learningProgress * 2);
      this.p.line(prev.x, prev.y, curr.x, curr.y);
    }
    
    this.p.pop();
  }
  
  /**
   * Draw particle effects
   */
  drawParticles() {
    this.p.push();
    for (let particle of this.particles) {
      const [r, g, b] = particle.color;
      this.p.fill(r, g, b, particle.life * 255);
      this.p.noStroke();
      this.p.ellipse(particle.x, particle.y, particle.size, particle.size);
    }
    this.p.pop();
  }
  
  /**
   * Draw spinning robot
   */
  show() {
    this.p.push();
    this.p.translate(this.position.x, this.position.y);
    this.p.rotate(this.rotationAngle);
    
    // Robot body (circle with pattern showing rotation)
    const size = 14;
    
    // Algorithm-specific colors (modern quartr.com style)
    let algorithmColor = { r: 100, g: 200, b: 255 }; // Default blue
    switch (this.algorithm) {
      case 'DDPG':
        algorithmColor = { r: 100, g: 200, b: 255 }; // Cyan-blue
        break;
      case 'TD3':
        algorithmColor = { r: 150, g: 100, b: 255 }; // Purple
        break;
      case 'SAC':
        algorithmColor = { r: 100, g: 255, b: 150 }; // Green-cyan
        break;
      case 'PPO':
        algorithmColor = { r: 255, g: 150, b: 100 }; // Orange
        break;
    }
    
    // Outer glow - different color when stuck (orange/red) vs normal (algorithm color with learning indicator)
    if (this.isStuck) {
      // Stuck indicator - pulsing orange/red
      const pulse = this.p.sin(this.p.millis() * 0.01) * 0.3 + 0.7;
      this.p.fill(255, 150, 50, pulse * 200);
      this.p.noStroke();
      this.p.ellipse(0, 0, size + 8, size + 8);
      
      // Main body - orange when stuck
      this.p.fill(255, 150, 50, 220);
      this.p.ellipse(0, 0, size, size);
    } else {
      // Outer glow - brightness based on learning progress (0.0 to 1.0) with algorithm color
      const learningGlow = this.p.map(this.learningProgress, 0, 1, 100, 255);
      this.p.fill(algorithmColor.r, algorithmColor.g, algorithmColor.b, learningGlow * 0.3);
      this.p.noStroke();
      this.p.ellipse(0, 0, size + 6, size + 6);
      
      // Main body - algorithm color with learning progress brightness
      const brightness = this.p.map(this.learningProgress, 0, 1, 0.7, 1.0);
      this.p.fill(
        algorithmColor.r * brightness,
        algorithmColor.g * brightness,
        algorithmColor.b * brightness,
        220
      );
      this.p.ellipse(0, 0, size, size);
    }
    
    // Spinning indicator (line showing rotation)
    this.p.stroke(255, 255, 100, 200);
    this.p.strokeWeight(2);
    this.p.line(0, 0, size / 2, 0);
    this.p.noStroke();
    
    // Center dot
    this.p.fill(255, 255, 100);
    this.p.ellipse(0, 0, 4, 4);
    
    this.p.pop();
    
    // Draw particle effects
    this.drawParticles();
  }
}

/**
 * Swarm Environment
 */
class SwarmEnvironment {
  constructor(width, height, numAgents, p5Instance, algorithm = 'DDPG') {
    this.width = width;
    this.height = height;
    this.p = p5Instance;
    this.robots = [];
    this.obstacles = [];
    this.obstacleIdCounter = 0; // Unique ID counter for obstacles
    this.algorithm = algorithm; // Current algorithm
    
    // Start and target positions - use minimal padding to maximize space
    const padding = 20; // Small padding to keep markers visible
    this.startPoint = { x: padding, y: height - padding };
    this.targetPoint = { x: width - padding, y: padding };
    
    // Initialize robots (1-3)
    const clamped = Math.max(1, Math.min(3, numAgents));
    for (let i = 0; i < clamped; i++) {
      const x = this.startPoint.x + this.p.random(-10, 10);
      const y = this.startPoint.y + this.p.random(-10, 10);
      this.robots.push(new LearningRobot(x, y, width, height, p5Instance, this.startPoint, algorithm));
    }
    
    // Preset obstacles
    this.initializeObstacles();
  }
  
  initializeObstacles() {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const r = Math.max(20, Math.min(this.width, this.height) * 0.04);
    
    // Create a path with obstacles
    this.addObstacle(cx - this.width * 0.25, cy - this.height * 0.20, r);
    this.addObstacle(cx - this.width * 0.20, cy + this.height * 0.10, r * 1.1);
    this.addObstacle(cx - this.width * 0.05, cy - this.height * 0.15, r * 1.2);
    this.addObstacle(cx + this.width * 0.05, cy + this.height * 0.15, r * 1.2);
    this.addObstacle(cx + this.width * 0.22, cy - this.height * 0.10, r);
    this.addObstacle(cx + this.width * 0.26, cy + this.height * 0.20, r);
  }
  
  addObstacle(x, y, radius) {
    // Each obstacle gets a unique ID so robots can learn about them individually
    const obstacle = { 
      id: this.obstacleIdCounter++, 
      x, 
      y, 
      radius 
    };
    this.obstacles.push(obstacle);
    return obstacle;
  }
  
  removeObstacles() {
    this.obstacles = [];
    // Reset counter when removing all obstacles (optional - could keep incrementing)
    // this.obstacleIdCounter = 0;
  }
  
  update() {
    // First, check if any robot reached the target and share knowledge
    const successfulRobots = this.robots.filter(r => r.reachedGoal && r.hasNewKnowledge);
    
    if (successfulRobots.length > 0) {
      // Share knowledge from successful robots to all others (collective knowledge)
      for (let successfulRobot of successfulRobots) {
        for (let otherRobot of this.robots) {
          if (otherRobot !== successfulRobot && !otherRobot.reachedGoal) {
            // Share both obstacle knowledge AND path knowledge
            successfulRobot.shareKnowledge(otherRobot, this.targetPoint);
          }
        }
      }
      
      // Mark knowledge as shared
      for (let successfulRobot of successfulRobots) {
        successfulRobot.hasNewKnowledge = false;
      }
    }
    
    // Update all robots with boids algorithm (from swarm_engine.py)
    for (let robot of this.robots) {
      // Robots stop at target (don't reset automatically - user must reset)
      if (robot.reachedGoal) {
        // Stay at target - don't update position
        robot.velocity.mult(0);
        robot.acceleration.mult(0);
        robot.timeAtGoal++;
        // No automatic reset - game will pause and wait for user reset
      } else if (robot.hitObstacle) {
        // Reset to origin when obstacle is hit - robot will use stored logic to avoid
        robot.reset(this.startPoint, 'obstacle');
      } else {
        // Pass all robots for boids behaviors (separation, alignment, cohesion)
        robot.update(this.robots, this.obstacles, this.targetPoint);
      }
    }
  }
  
  /**
   * Check if any robot has reached the target (for visual feedback)
   */
  hasAnyRobotReachedTarget() {
    return this.robots.some(robot => robot.reachedGoal);
  }
  
  /**
   * Check if ALL robots have reached the target (for game completion)
   */
  haveAllRobotsReachedTarget() {
    if (this.robots.length === 0) return false;
    return this.robots.every(robot => robot.reachedGoal);
  }
  
  getMetrics() {
    if (this.robots.length === 0) {
      return { 
        totalSuccess: 0, 
        swarmCohesion: 0, 
        averageSpeed: 0, 
        totalCollisions: 0, 
        avgLearningProgress: 0, 
        totalEpisodes: 0,
        avgAvoidanceRate: 0,
        efficiency: 0
      };
    }
    
    const totalSuccess = this.robots.reduce((sum, r) => sum + (r.successCount || 0), 0);
    const totalCollisions = this.robots.reduce((sum, r) => sum + (r.collisionCount || 0), 0);
    const totalEpisodes = this.robots.reduce((sum, r) => sum + (r.episodeCount || 0), 0);
    const avgLearningProgress = this.robots.length > 0 
      ? this.robots.reduce((sum, r) => sum + (r.learningProgress || 0), 0) / this.robots.length 
      : 0;
    
    // Calculate average avoidance success rate (NASA/NVIDIA style metric)
    const avgAvoidanceRate = this.robots.length > 0
      ? this.robots.reduce((sum, r) => sum + (r.avoidanceSuccessRate || 0), 0) / this.robots.length
      : 0;
    
    // Calculate average speed (from swarm_engine.py _calculate_metrics)
    const speeds = this.robots.map(r => r.velocity.mag());
    const averageSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    
    // Calculate swarm cohesion (from swarm_engine.py _calculate_metrics)
    const positions = this.robots.map(r => r.position);
    const center = this.p.createVector(0, 0);
    positions.forEach(pos => center.add(pos));
    center.div(positions.length);
    
    const distances = positions.map(pos => p5.Vector.dist(pos, center));
    const avgDistance = distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
    const swarmCohesion = 1.0 / (1.0 + avgDistance);
    
    // Calculate efficiency metric (success rate normalized by episodes)
    const efficiency = totalEpisodes > 0 ? (totalSuccess / totalEpisodes) * 100 : 0;
    
    return { 
      totalSuccess, 
      swarmCohesion, 
      averageSpeed, 
      totalCollisions, 
      avgLearningProgress, 
      totalEpisodes,
      avgAvoidanceRate,
      efficiency
    };
  }
  
  setNumRobots(count) {
    const clamped = Math.max(1, Math.min(3, count));
    const currentCount = this.robots.length;
    
    if (clamped > currentCount) {
      // Add robots
      for (let i = 0; i < clamped - currentCount; i++) {
        const x = this.startPoint.x + this.p.random(-10, 10);
        const y = this.startPoint.y + this.p.random(-10, 10);
        this.robots.push(new LearningRobot(x, y, this.width, this.height, this.p, this.startPoint, this.algorithm));
      }
    } else if (clamped < currentCount) {
      // Remove robots
      this.robots = this.robots.slice(0, clamped);
    }
  }
  
  /**
   * Change algorithm for all robots
   */
  setAlgorithm(algorithm) {
    this.algorithm = algorithm;
    for (let robot of this.robots) {
      robot.algorithm = algorithm;
      robot.initAlgorithmParams();
    }
  }
  
  resetAll() {
    for (let robot of this.robots) {
      robot.reset(this.startPoint);
      robot.successCount = 0;
      robot.episodeCount = 0;
      robot.episodeMetrics = [];
      robot.learningProgress = 0.0;
      robot.bestEpisodeTime = Infinity;
      robot.bestEpisodeCollisions = Infinity;
      robot.collisionCount = 0;
      // Reset to initial behavior weights
      robot.goalWeight = 2.5;
      robot.cohesionWeight = 1.0;
      robot.separationWeight = 2.0;
      // Reset learned obstacle avoidance completely (clear obstacle-specific knowledge)
      robot.collisionMemory.clear();
    }
  }
}

/**
 * Create the Swarm Simulation component
 */
export function createRLSimulation(options = {}) {
  const {
    container,
    width = null,
    height = 450
  } = options;

  if (!container) {
    console.error('SwarmSimulation: container is required');
    return null;
  }

  // Create main container
  const wrapper = document.createElement('div');
  wrapper.className = 'rl-simulation-container';
  
  // Create controls panel first (to measure its height)
  const controlsPanel = document.createElement('div');
  controlsPanel.className = 'rl-simulation-controls-stats';
  
  // Create canvas container
  const canvasContainer = document.createElement('div');
  canvasContainer.className = 'rl-simulation-canvas-container';
  canvasContainer.style.position = 'relative';
  canvasContainer.style.overflow = 'hidden';
  canvasContainer.style.background = 'rgb(21, 26, 54)'; // Van Gogh Starry Night deep navy blue
  
  // Append controls panel first, then canvas container
  wrapper.appendChild(canvasContainer);
  
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'rl-controls-panel';
  
  // Title
  const title = document.createElement('h3');
  title.className = 'rl-controls-title';
  title.textContent = 'SWARM CONTROL';
  controlsDiv.appendChild(title);
  
  // Algorithm selector
  const algorithmDiv = document.createElement('div');
  algorithmDiv.className = 'rl-slider-container';
  const algorithmLabel = document.createElement('label');
  algorithmLabel.textContent = 'Algorithm: ';
  algorithmLabel.className = 'rl-slider-label';
  const algorithmSelect = document.createElement('select');
  algorithmSelect.className = 'rl-algorithm-select';
  algorithmSelect.innerHTML = `
    <option value="DDPG">DDPG (Deep Deterministic Policy Gradient)</option>
    <option value="TD3">TD3 (Twin Delayed DDPG)</option>
    <option value="SAC">SAC (Soft Actor-Critic)</option>
    <option value="PPO">PPO (Proximal Policy Optimization)</option>
  `;
  algorithmSelect.value = 'DDPG';
  algorithmLabel.appendChild(algorithmSelect);
  algorithmDiv.appendChild(algorithmLabel);
  controlsDiv.appendChild(algorithmDiv);
  
  // Bot count slider
  const botCountDiv = document.createElement('div');
  botCountDiv.className = 'rl-slider-container';
  const botCountLabel = document.createElement('label');
  botCountLabel.textContent = 'Bots: ';
  botCountLabel.className = 'rl-slider-label';
  const botCountSlider = document.createElement('input');
  botCountSlider.type = 'range';
  botCountSlider.min = '1';
  botCountSlider.max = '3';
  botCountSlider.value = '3';
  botCountSlider.step = '1';
  botCountSlider.className = 'rl-slider';
  const botCountValue = document.createElement('span');
  botCountValue.className = 'rl-slider-value';
  botCountValue.textContent = '3';
  botCountSlider.addEventListener('input', () => {
    botCountValue.textContent = botCountSlider.value;
  });
  botCountDiv.appendChild(botCountLabel);
  botCountDiv.appendChild(botCountSlider);
  botCountDiv.appendChild(botCountValue);
  controlsDiv.appendChild(botCountDiv);
  
  // Buttons
  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'rl-buttons-container';
  
  const playPauseBtn = document.createElement('button');
  playPauseBtn.className = 'rl-control-btn';
  playPauseBtn.textContent = 'Play';
  playPauseBtn.setAttribute('data-action', 'play');
  
  const resetBtn = document.createElement('button');
  resetBtn.className = 'rl-control-btn';
  resetBtn.textContent = 'Reset';
  resetBtn.setAttribute('data-action', 'reset');
  
  const moveObstaclesBtn = document.createElement('button');
  moveObstaclesBtn.className = 'rl-control-btn';
  moveObstaclesBtn.textContent = 'Move Obstacles';
  moveObstaclesBtn.setAttribute('data-action', 'move');
  
  buttonsDiv.appendChild(playPauseBtn);
  buttonsDiv.appendChild(resetBtn);
  buttonsDiv.appendChild(moveObstaclesBtn);
  controlsDiv.appendChild(buttonsDiv);
  
  controlsPanel.appendChild(controlsDiv);
  
  // Stats panel
  const statsPanel = document.createElement('div');
  statsPanel.className = 'rl-stats-panel';
  const statsTitle = document.createElement('h4');
  statsTitle.textContent = 'Learning Metrics';
  statsPanel.appendChild(statsTitle);
  
  const statsDisplay = document.createElement('div');
  statsDisplay.className = 'rl-stats-display';
  statsDisplay.innerHTML = `
    <div class="rl-stat-item"><span class="rl-stat-label">Algorithm:</span> <span class="rl-stat-value" id="stat-algorithm">DDPG</span></div>
    <div class="rl-stat-item"><span class="rl-stat-label">Episodes:</span> <span class="rl-stat-value" id="stat-episodes">0</span></div>
    <div class="rl-stat-item"><span class="rl-stat-label">Successes:</span> <span class="rl-stat-value" id="stat-successes">0</span></div>
    <div class="rl-stat-item"><span class="rl-stat-label">Learning:</span> <span class="rl-stat-value" id="stat-learning">0%</span></div>
    <div class="rl-stat-item"><span class="rl-stat-label">Cohesion:</span> <span class="rl-stat-value" id="stat-cohesion">0.000</span></div>
    <div class="rl-stat-item"><span class="rl-stat-label">Avg Speed:</span> <span class="rl-stat-value" id="stat-speed">0.00</span></div>
    <div class="rl-stat-item"><span class="rl-stat-label">Collisions:</span> <span class="rl-stat-value" id="stat-collisions">0</span></div>
  `;
  statsPanel.appendChild(statsDisplay);
  
  controlsPanel.appendChild(statsPanel);
  wrapper.appendChild(controlsPanel);
  
  container.appendChild(wrapper);
  
  // Function to sync canvas container height with controls panel
  function syncCanvasHeight() {
    // Wait for layout to settle
    requestAnimationFrame(() => {
      const controlsHeight = controlsPanel.offsetHeight;
      if (controlsHeight > 0) {
        canvasContainer.style.height = `${controlsHeight}px`;
        // Trigger canvas resize if p5 instance exists
        if (p5Instance && p5Instance._resize) {
          p5Instance._resize();
        }
      }
    });
  }
  
  // Sync height initially and on resize
  syncCanvasHeight();
  const resizeObserver = new ResizeObserver(() => {
    syncCanvasHeight();
  });
  resizeObserver.observe(controlsPanel);
  resizeObserver.observe(canvasContainer);
  
  // Load p5.js and initialize
  loadP5JS().then(() => {
    if (!window.p5) {
      console.error('p5.js failed to load');
      return;
    }
    
    const instance = initP5Sketch(canvasContainer, statsDisplay, {
      playPauseBtn,
      resetBtn,
      moveObstaclesBtn,
      botCountSlider,
      algorithmSelect
    }, syncCanvasHeight);
    p5Instance = instance;
    
    wrapper._rlSimulation = {
      destroy: () => {
        if (instance && typeof instance.remove === 'function') {
          instance.remove();
        }
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
      }
    };
  });
  
  return wrapper;
}

/**
 * Initialize p5.js sketch
 */
function initP5Sketch(container, statsDisplay, controls, syncHeightCallback) {
  const sketch = (p) => {
    let canvasWidth, canvasHeight;
    let swarm;
    let paused = true; // Start paused - user must press play
    let editMode = false; // Edit mode for moving obstacles
    let draggingObstacleIndex = -1;
    let currentAlgorithm = controls.algorithmSelect ? controls.algorithmSelect.value : 'DDPG';
    
    const colors = {
      background: [21, 26, 54], // Van Gogh Starry Night deep navy blue
      grid: [40, 60, 100], // Lighter blue grid for contrast
      obstacle: [255, 100, 100],
      obstacleGlow: [255, 150, 150],
      start: [120, 200, 255],
      target: [255, 80, 80],
      text: [255, 255, 255]
    };
    
    function updateCanvasSize() {
      const rect = container.getBoundingClientRect();
      canvasWidth = rect.width || container.offsetWidth;
      canvasHeight = rect.height || container.offsetHeight || 600;
      
      // Ensure we use the full container height
      if (canvasHeight < 400) {
        canvasHeight = container.offsetHeight || 600;
      }
    }
    
    p.setup = () => {
      updateCanvasSize();
      
      const canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent(container);
      canvas.style.position = 'relative';
      canvas.style.zIndex = '1';
      
      swarm = new SwarmEnvironment(canvasWidth, canvasHeight, 3, p, currentAlgorithm);
      updateStats();
      
      // Sync height after setup
      if (syncHeightCallback) {
        setTimeout(syncHeightCallback, 100);
      }
    };
    
    p.windowResized = () => {
      updateCanvasSize();
      
      if (canvasWidth > 0 && canvasHeight > 0) {
        p.resizeCanvas(canvasWidth, canvasHeight);
        
        const numRobots = swarm ? swarm.robots.length : 3;
        swarm = new SwarmEnvironment(canvasWidth, canvasHeight, numRobots, p, currentAlgorithm);
      }
      
      // Resync height on window resize
      if (syncHeightCallback) {
        setTimeout(syncHeightCallback, 100);
      }
    };
    
    function drawBackground() {
      p.background(colors.background[0], colors.background[1], colors.background[2]);
      
      // Grid
      p.stroke(colors.grid[0], colors.grid[1], colors.grid[2]);
      p.strokeWeight(0.5);
      for (let x = 0; x <= canvasWidth; x += 50) {
        p.line(x, 0, x, canvasHeight);
      }
      for (let y = 0; y <= canvasHeight; y += 50) {
        p.line(0, y, canvasWidth, y);
      }
      p.noStroke();
    }
    
    function drawObstacles() {
      for (let obs of swarm.obstacles) {
        // Enhanced visualization with gradient rings (NASA/NVIDIA style)
        p.push();
        
        // Outer glow ring (larger, more visible)
        if (editMode) {
          const pulse = p.sin(p.millis() * 0.005) * 0.3 + 0.7;
          p.fill(colors.obstacleGlow[0], colors.obstacleGlow[1], colors.obstacleGlow[2], pulse * 150);
          p.noStroke();
          p.ellipse(obs.x, obs.y, obs.radius * 2 + 20, obs.radius * 2 + 20);
        } else {
          // Normal glow with subtle pulsing
          const subtlePulse = p.sin(p.millis() * 0.003) * 0.1 + 0.9;
          p.fill(colors.obstacleGlow[0], colors.obstacleGlow[1], colors.obstacleGlow[2], 100 * subtlePulse);
          p.noStroke();
          p.ellipse(obs.x, obs.y, obs.radius * 2 + 12, obs.radius * 2 + 12);
        }
        
        // Middle glow ring
        p.fill(colors.obstacleGlow[0], colors.obstacleGlow[1], colors.obstacleGlow[2], 60);
        p.ellipse(obs.x, obs.y, obs.radius * 2 + 6, obs.radius * 2 + 6);
        
        // Main obstacle with gradient effect
        // Create radial gradient effect using multiple circles
        for (let i = 3; i >= 0; i--) {
          const alpha = 200 - (i * 30);
          const size = obs.radius * 2 - (i * 2);
          p.fill(colors.obstacle[0], colors.obstacle[1], colors.obstacle[2], alpha);
          p.ellipse(obs.x, obs.y, size, size);
        }
        
        // Highlight on top
        p.fill(255, 255, 255, 40);
        p.ellipse(obs.x - obs.radius * 0.3, obs.y - obs.radius * 0.3, obs.radius * 0.8, obs.radius * 0.8);
        
        // Outline - thicker in edit mode
        p.stroke(colors.obstacleGlow[0], colors.obstacleGlow[1], colors.obstacleGlow[2]);
        p.strokeWeight(editMode ? 2.5 : 1.5);
        p.noFill();
        p.ellipse(obs.x, obs.y, obs.radius * 2, obs.radius * 2);
        p.noStroke();
        
        p.pop();
      }
    }
    
    function drawStartTarget() {
      p.push();
      p.noStroke();
      
      // START marker
      p.fill(colors.start[0], colors.start[1], colors.start[2], 220);
      p.ellipse(swarm.startPoint.x, swarm.startPoint.y, 18, 18);
      p.fill(255);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('START', swarm.startPoint.x, swarm.startPoint.y - 12);
      
      // TARGET marker - green if any robot has reached it, red otherwise
      const targetReached = swarm.hasAnyRobotReachedTarget();
      if (targetReached) {
        // Green glow when target is reached (draw behind main circle)
        p.fill(100, 255, 100, 100);
        p.ellipse(swarm.targetPoint.x, swarm.targetPoint.y, 24, 24);
        // Green color when target is reached
        p.fill(100, 255, 100, 230);
      } else {
        // Red color when target not reached
        p.fill(colors.target[0], colors.target[1], colors.target[2], 230);
      }
      p.ellipse(swarm.targetPoint.x, swarm.targetPoint.y, 18, 18);
      p.fill(255);
      p.textAlign(p.CENTER, p.TOP);
      p.text('TARGET', swarm.targetPoint.x, swarm.targetPoint.y + 12);
      
      p.pop();
    }
    
    function drawRobots() {
      // Draw connection lines between robots (swarm cohesion visualization)
      if (swarm.robots.length > 1) {
        p.push();
        p.stroke(100, 200, 255, 80);
        p.strokeWeight(1);
        p.noFill();
        
        for (let i = 0; i < swarm.robots.length; i++) {
          for (let j = i + 1; j < swarm.robots.length; j++) {
            const r1 = swarm.robots[i];
            const r2 = swarm.robots[j];
            const dist = p.dist(r1.position.x, r1.position.y, r2.position.x, r2.position.y);
            
            // Draw line if robots are within neighbor radius (showing swarm cohesion)
            if (dist < r1.neighborRadius) {
              // Alpha based on distance (closer = more visible)
              const alpha = p.map(dist, 0, r1.neighborRadius, 120, 30);
              p.stroke(100, 200, 255, alpha);
              p.line(r1.position.x, r1.position.y, r2.position.x, r2.position.y);
            }
          }
        }
        p.pop();
      }
      
      // Draw trails first (behind robots)
      for (let robot of swarm.robots) {
        robot.drawTrail();
      }
      
      // Draw robots on top
      for (let robot of swarm.robots) {
        robot.show();
      }
    }
    
    function updateStats() {
      if (!swarm) return;
      
      const metrics = swarm.getMetrics();
      
      // Update algorithm display
      const algorithmEl = document.getElementById('stat-algorithm');
      if (algorithmEl) {
        algorithmEl.textContent = currentAlgorithm;
      }
      
      // Update stats with safety checks
      const episodesEl = document.getElementById('stat-episodes');
      const successesEl = document.getElementById('stat-successes');
      const learningEl = document.getElementById('stat-learning');
      
      if (episodesEl) episodesEl.textContent = metrics.totalEpisodes || 0;
      if (successesEl) successesEl.textContent = metrics.totalSuccess || 0;
      
      // Ensure learning progress is a valid number
      const learningProgress = isNaN(metrics.avgLearningProgress) ? 0 : metrics.avgLearningProgress;
      if (learningEl) learningEl.textContent = `${Math.round(learningProgress * 100)}%`;
      
      document.getElementById('stat-cohesion').textContent = (metrics.swarmCohesion || 0).toFixed(3);
      document.getElementById('stat-speed').textContent = (metrics.averageSpeed || 0).toFixed(2);
      document.getElementById('stat-collisions').textContent = metrics.totalCollisions || 0;
    }
    
    p.draw = () => {
      drawBackground();
      
      if (!paused && swarm) {
        swarm.update();
        
        // Auto-pause when ALL robots reach the target
        if (swarm.haveAllRobotsReachedTarget()) {
          paused = true;
          controls.playPauseBtn.textContent = 'Play';
        }
      }
      
      // Always update stats (even when paused) so metrics are visible
      updateStats();
      
      drawObstacles();
      drawStartTarget();
      drawRobots();
    };
    
    // Mouse interactions
    p.mousePressed = (event) => {
      if (p.mouseX >= 0 && p.mouseX <= canvasWidth && 
          p.mouseY >= 0 && p.mouseY <= canvasHeight) {
        // Only allow obstacle dragging in edit mode
        if (editMode && event.button === 0 && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          for (let i = 0; i < swarm.obstacles.length; i++) {
            const obs = swarm.obstacles[i];
            const d = p.dist(p.mouseX, p.mouseY, obs.x, obs.y);
            if (d <= obs.radius + 6) {
              draggingObstacleIndex = i;
              event.preventDefault();
              return false;
            }
          }
        }
        // Right-click or Ctrl+click to add obstacle (only in edit mode)
        if (editMode && (event.button === 2 || (event.button === 0 && event.ctrlKey))) {
          const radius = p.random(20, 40);
          swarm.addObstacle(p.mouseX, p.mouseY, radius);
          event.preventDefault();
          return false;
        }
      }
    };
    
    p.mouseDragged = () => {
      if (editMode && draggingObstacleIndex >= 0) {
        const obs = swarm.obstacles[draggingObstacleIndex];
        obs.x = p.constrain(p.mouseX, obs.radius, canvasWidth - obs.radius);
        obs.y = p.constrain(p.mouseY, obs.radius, canvasHeight - obs.radius);
        return false;
      }
    };
    
    p.mouseReleased = () => {
      draggingObstacleIndex = -1;
    };
    
    // Prevent context menu
    const canvas = p.canvas;
    if (canvas) {
      canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
    }
    
    // Control handlers
    controls.playPauseBtn.addEventListener('click', () => {
      paused = !paused;
      controls.playPauseBtn.textContent = paused ? 'Play' : 'Pause';
      
      // When playing, exit edit mode and lock obstacles
      if (!paused && editMode) {
        editMode = false;
        controls.moveObstaclesBtn.textContent = 'Move Obstacles';
        draggingObstacleIndex = -1; // Release any dragged obstacle
      }
    });
    
    controls.resetBtn.addEventListener('click', () => {
      swarm.resetAll();
      updateStats();
      // Keep paused after reset - user must press Play to restart
      paused = true;
      controls.playPauseBtn.textContent = 'Play';
    });
    
    controls.moveObstaclesBtn.addEventListener('click', () => {
      if (!editMode) {
        // Enter edit mode: pause game, enable obstacle movement
        editMode = true;
        paused = true;
        controls.moveObstaclesBtn.textContent = 'Lock Obstacles';
        controls.playPauseBtn.textContent = 'Play';
      } else {
        // Exit edit mode: lock obstacles (but keep paused)
        editMode = false;
        controls.moveObstaclesBtn.textContent = 'Move Obstacles';
        draggingObstacleIndex = -1; // Release any dragged obstacle
      }
    });
    
    controls.botCountSlider.addEventListener('input', () => {
      const count = parseInt(controls.botCountSlider.value);
      swarm.setNumRobots(count);
      updateStats();
    });
    
    // Algorithm selector event handler
    if (controls.algorithmSelect) {
      controls.algorithmSelect.addEventListener('change', () => {
        currentAlgorithm = controls.algorithmSelect.value;
        if (swarm) {
          swarm.setAlgorithm(currentAlgorithm);
          // Update algorithm display
          const algorithmEl = document.getElementById('stat-algorithm');
          if (algorithmEl) {
            algorithmEl.textContent = currentAlgorithm;
          }
          // Reset to show algorithm differences immediately
          swarm.resetAll();
          updateStats();
        }
      });
    }
    
    return {
      pause: () => {
        paused = !paused;
        controls.playPauseBtn.textContent = paused ? 'Play' : 'Pause';
      },
      reset: () => {
        swarm.resetAll();
        updateStats();
      },
      moveObstacles: () => {
        editMode = !editMode;
        paused = editMode; // Pause when entering edit mode
        controls.moveObstaclesBtn.textContent = editMode ? 'Lock Obstacles' : 'Move Obstacles';
        controls.playPauseBtn.textContent = paused ? 'Play' : 'Pause';
      },
      getSwarm: () => swarm
    };
  };
  
  return new p5(sketch);
}
