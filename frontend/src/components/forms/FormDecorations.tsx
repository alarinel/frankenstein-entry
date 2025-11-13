/**
 * Decorative corner elements for the form page
 * Displays animated emojis in the corners
 */
export const FormDecorations = () => {
  return (
    <>
      <div 
        className="absolute animate-swing"
        style={{ 
          top: 'clamp(0.75rem, 2vh, 1.25rem)',
          left: 'clamp(0.75rem, 2vw, 1.25rem)',
          fontSize: 'clamp(2.5rem, 5vw, 3rem)'
        }}
      >🕷️</div>
      <div 
        className="absolute animate-swing" 
        style={{ 
          animationDelay: '0.5s',
          top: 'clamp(0.75rem, 2vh, 1.25rem)',
          right: 'clamp(0.75rem, 2vw, 1.25rem)',
          fontSize: 'clamp(2.5rem, 5vw, 3rem)'
        }}
      >
        🕸️
      </div>
      <div 
        className="absolute animate-bounce-subtle"
        style={{ 
          bottom: 'clamp(0.75rem, 2vh, 1.25rem)',
          left: 'clamp(0.75rem, 2vw, 1.25rem)',
          fontSize: 'clamp(2.5rem, 5vw, 3rem)'
        }}
      >🎃</div>
      <div 
        className="absolute animate-bounce-subtle" 
        style={{ 
          animationDelay: '0.7s',
          bottom: 'clamp(0.75rem, 2vh, 1.25rem)',
          right: 'clamp(0.75rem, 2vw, 1.25rem)',
          fontSize: 'clamp(2.5rem, 5vw, 3rem)'
        }}
      >
        🌙
      </div>
    </>
  );
};
