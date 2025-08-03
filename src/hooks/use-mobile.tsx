import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize with proper mobile detection on first render
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    return false
  })

  React.useEffect(() => {
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < MOBILE_BREAKPOINT
      console.log('Mobile check:', { 
        width: window.innerWidth, 
        breakpoint: MOBILE_BREAKPOINT, 
        isMobile: isMobileNow,
        userAgent: navigator.userAgent 
      })
      setIsMobile(isMobileNow)
    }

    // Set initial state
    checkMobile()

    // Use both resize and media query for better mobile detection
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => checkMobile()
    
    mql.addEventListener("change", onChange)
    window.addEventListener("resize", onChange)
    
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("resize", onChange)
    }
  }, [])

  return isMobile
}
