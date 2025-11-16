import {Story, StoryPage} from '@/types';
import {TextHighlightDisplay} from './TextHighlightDisplay';

interface Book3DDisplayProps {
    currentPage: StoryPage;
    story: Story;
    imageUrl: string;
    textPosition: 'left' | 'right' | 'hidden';
    words: string[];
    highlightedWords: Set<number>;
}

export const Book3DDisplay = ({
                                  currentPage,
                                  story,
                                  imageUrl,
                                  textPosition,
                                  words,
                                  highlightedWords,
                              }: Book3DDisplayProps) => {
    return (
        <div
            className="relative z-20"
            style={{
                perspective: '2000px',
                perspectiveOrigin: 'center center',
                maxWidth: 'min(90vw, 1500px)',
                width: '100%',
                margin: '0 auto',
            }}
        >
            {/* Book Shadow */}
            <div className="absolute inset-0 bg-black/30 rounded-3xl blur-2xl transform translate-y-8"/>

            {/* Main Book Container */}
            <div
                className="relative mx-auto flex"
                style={{
                    transformStyle: 'preserve-3d',
                    height: 'clamp(500px, min(70vh, 600px), 1700px)',
                    width: 'min(100%, calc((clamp(1000px, min(70vh, 900px), 1400px)) * 5 / 3))',
                    maxWidth: '1700px',
                }}
            >
                {/* Left Page with Image and Text */}
                <div
                    className="relative bg-amber-50"
                    style={{
                        transformStyle: 'preserve-3d',
                        width: '50%',
                        transformOrigin: 'right center',
                        transform: 'rotateY(30deg) translateZ(5px)',
                        overflow: 'hidden',
                        borderBottom: '10px solid black',
                        borderLeft: '8px solid black',
                        borderRight: '5px solid black',
                        borderTop: '5px solid black'
                    }}
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '200%',
                                height: '100%',
                            }}
                        >
                            <img
                                src={
                                    imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E'
                                }
                                alt={`Page ${currentPage?.pageNumber || 0} - Left`}
                                style={{
                                    display: imageUrl ? 'block' : 'none',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'left center',
                                }}
                            />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 rounded-l-3xl"/>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 rounded-l-3xl"/>

                    {/* Text on Left Page */}
                    {textPosition === 'left' && (
                        <div className="absolute inset-0 flex items-end justify-center p-4 z-20">
                            <TextHighlightDisplay
                                words={words}
                                highlightedWords={highlightedWords}
                                textPosition={textPosition}
                                currentPage={currentPage}
                                story={story}
                            />
                        </div>
                    )}
                </div>

                {/* Right Page with Image and Text */}
                <div
                    className="relative bg-amber-50"
                    style={{
                        transformStyle: 'preserve-3d',
                        width: '50%',
                        transformOrigin: 'left center',
                        transform: 'rotateY(-30deg) translateZ(5px)',
                        overflow: 'visible',
                        borderBottom: '10px solid black',
                        borderRight: '8px solid black',
                        borderLeft: '5px solid black',
                        borderTop: '5px solid black'
                    }}
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                width: '200%',
                                height: '100%',
                            }}
                        >
                            <img
                                src={
                                    imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E'
                                }
                                alt={`Page ${currentPage?.pageNumber || 0} - Right`}
                                style={{
                                    display: imageUrl ? 'block' : 'none',
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'right center',
                                }}
                            />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 rounded-r-3xl"/>
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 rounded-r-3xl"/>

                    {/* Text on Right Page */}
                    {textPosition === 'right' && (
                        <div className="absolute inset-0 flex items-end justify-center p-4 z-20">
                            <TextHighlightDisplay
                                words={words}
                                highlightedWords={highlightedWords}
                                textPosition={textPosition}
                                currentPage={currentPage}
                                story={story}
                            />
                        </div>
                    )}
                </div>

                {/*/!* Spine *!/*/}
                {/*<div*/}
                {/*    className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 z-30"*/}
                {/*    style={{*/}
                {/*        transformStyle: 'preserve-3d',*/}
                {/*        background: 'black',*/}
                {/*        boxShadow: `inset 0 0 0px rgba(0, 0, 0, 1), 0 0 30px rgba(0, 0, 0, 0.8)`,*/}
                {/*        width: 'clamp(4px, 0.5vw, 15px)',*/}
                {/*        border: '2px solid black'*/}
                {/*    }}*/}
                {/*/>*/}
            </div>
        </div>
    );
};
