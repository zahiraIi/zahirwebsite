export default function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border" data-testid="footer">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Zahir Ali. Built with React, TypeScript, and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
