import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background/95 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SpaceX Explorer</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Track SpaceX launches, explore mission details, and save your favorite launches.
              Built with Next.js, TypeScript, and the SpaceX API.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/launches" className="group relative text-sm text-muted-foreground hover:text-foreground transition-all duration-300 inline-block">
                  <span className="relative">
                    All Launches
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/launches?status=upcoming" className="group relative text-sm text-muted-foreground hover:text-foreground transition-all duration-300 inline-block">
                  <span className="relative">
                    Upcoming Launches
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/launches?status=past" className="group relative text-sm text-muted-foreground hover:text-foreground transition-all duration-300 inline-block">
                  <span className="relative">
                    Past Launches
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="group relative text-sm text-muted-foreground hover:text-foreground transition-all duration-300 inline-block">
                  <span className="relative">
                    My Favorites
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://www.spacex.com/" target="_blank" rel="noopener noreferrer" className="group relative text-sm text-muted-foreground hover:text-foreground transition-all duration-300 inline-block">
                  <span className="relative">
                    SpaceX Official
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://github.com/r-spacex/SpaceX-API" target="_blank" rel="noopener noreferrer" className="group relative text-sm text-muted-foreground hover:text-foreground transition-all duration-300 inline-block">
                  <span className="relative">
                    SpaceX API
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="https://www.spacex.com/launches/" target="_blank" rel="noopener noreferrer" className="group relative text-sm text-muted-foreground hover:text-foreground transition-all duration-300 inline-block">
                  <span className="relative">
                    Launch Schedule
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} SpaceX Explorer. Not affiliated with SpaceX. All data is provided by the SpaceX API.
          </p>
        </div>
      </div>
    </footer>
  );
}
