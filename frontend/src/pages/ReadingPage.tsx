import {useMemo} from 'react';
import {useParams} from 'react-router-dom';

import {storyApi} from '@/api/client';
import {SubtleParticleBackground} from '@/components/SubtleParticleBackground';
import {FloatingBats} from '@/components/spooky/FloatingBats';
import {FloatingCandles} from '@/components/spooky/FloatingCandles';
import {MagicSparkles} from '@/components/spooky/MagicSparkles';
import {ActionButton} from '@/components/shared';

import {AudioProgressDisplay, Book3DDisplay, PageNavigationButtons, PlaybackControls, PlayPromptOverlay,} from '@/components/reading';

import {useTextHighlighting} from '@/hooks/useTextHighlighting';
import {useReadingPageHandlers, useReadingPageState} from '@/hooks/reading';
import {getThemeForTimeOfDay} from '@/api/sunriseSunset';

export const ReadingPage = () => {
    const {storyId} = useParams<{ storyId: string }>();

    // Reading page state hook
    const {
        currentStory,
        currentPage,
        isLoading,
        isFlipping,
        isPlaying,
        showPlayPrompt,
        textPosition,
        timeOfDay,
        audioProgress,
        countdown,
        isCountingDown,
        canGoNext,
        canGoPrevious,
        audioHook,
        nextPage,
        previousPage,
        clearCountdown,
        toggleTextPosition,
        setShowPlayPrompt,
        setIsPlaying,
    } = useReadingPageState({storyId});

    // Get current page data
    const currentPageData = useMemo(() => {
        if (!currentStory || !currentStory.pages[currentPage]) {
            return null;
        }
        return currentStory.pages[currentPage];
    }, [currentStory?.id, currentPage, currentStory?.pages]);

    // Text highlighting hook
    const {highlightedWords, reset: resetHighlighting} = useTextHighlighting({
        text: currentPageData?.text || '',
        duration: currentPageData?.duration || 0,
        isPlaying: isPlaying,
        isActive: !!currentPageData,
    });

    // Memoize words and image URL
    const words = useMemo(() => currentPageData?.text.split(' ') || [], [currentPageData?.text]);
    const imageUrl = useMemo(() =>
            currentPageData ? storyApi.getAssetUrl(currentPageData.imageUrl) : '',
        [currentPageData?.imageUrl]
    );

    // Event handlers
    const {
        handleStartReading,
        handleNextPage,
        handlePreviousPage,
        handleTogglePlayPause,
        handleBackToMenu,
    } = useReadingPageHandlers({
        storyId,
        currentStory,
        canGoNext,
        canGoPrevious,
        isPlaying,
        audioHook,
        nextPage,
        previousPage,
        clearCountdown,
        resetHighlighting,
        setShowPlayPrompt,
        setIsPlaying,
    });

    if (isLoading || !currentStory || !currentPageData) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="text-4xl">Loading...</div>
            </div>
        );
    }

    const theme = getThemeForTimeOfDay(timeOfDay);

    return (
        <div className={`h-screen bg-gradient-to-br ${theme.from} ${theme.via} ${theme.to} flex flex-col overflow-hidden relative`}>
            {/* Background Elements - Optimized for performance to prevent Chrome crashes */}
            {/* Set enabled={false} on SubtleParticleBackground to completely disable particles if needed */}
            <SubtleParticleBackground
                intensity={theme.intensity as 'light' | 'medium' | 'dark'}
                enabled={true}
            />
            <FloatingBats count={2}/>
            <FloatingCandles/>
            <MagicSparkles isActive={false}/>

            {/* Decorative Corners */}
            <div
                className="absolute animate-float-slow z-10"
                style={{
                    top: 'clamp(0.75rem, 2vh, 1.25rem)',
                    left: 'clamp(0.75rem, 2vw, 1.25rem)',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)'
                }}
            >📚
            </div>
            <div
                className="absolute animate-float z-10"
                style={{
                    animationDelay: '0.5s',
                    top: 'clamp(0.75rem, 2vh, 1.25rem)',
                    right: 'clamp(0.75rem, 2vw, 1.25rem)',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)'
                }}
            >⭐
            </div>
            <div
                className="absolute animate-bounce-subtle z-10"
                style={{
                    bottom: 'clamp(0.75rem, 2vh, 1.25rem)',
                    left: 'clamp(0.75rem, 2vw, 1.25rem)',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)'
                }}
            >🌙
            </div>
            <div
                className="absolute animate-bounce-subtle z-10"
                style={{
                    animationDelay: '0.7s',
                    bottom: 'clamp(0.75rem, 2vh, 1.25rem)',
                    right: 'clamp(0.75rem, 2vw, 1.25rem)',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)'
                }}
            >🎭
            </div>

            {/* Play Prompt Overlay */}
            <PlayPromptOverlay show={showPlayPrompt} onStart={handleStartReading}/>

            {/* Back Button */}
            <div className="absolute top-4 left-4 z-50">
                <ActionButton onClick={handleBackToMenu} variant="ghost" size="sm">
                    <span className="text-xl">🏠</span>
                    <span className="hidden md:inline">Menu</span>
                </ActionButton>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center" style={{padding: '0 clamp(0.5rem, 1.5vw, 1rem)', overflow: 'hidden'}}>
                <div className="w-full flex flex-col items-center h-full"
                     style={{maxWidth: '2000px', paddingTop: 'clamp(1rem, 3vh, 2.5rem)', paddingBottom: 'clamp(0.5rem, 1vh, 0.75rem)'}}>
                    {/* Story Title */}
                    <div className="w-full z-20" style={{flexShrink: 0}}>
                        <h1
                            className="font-spooky bg-gradient-to-r from-spooky-purple-400 via-spooky-pink-400 to-spooky-orange-400 bg-clip-text text-transparent text-center"
                            style={{fontSize: 'clamp(2.125rem, 1.5vw, 1.4rem)'}}
                        >
                            {currentStory.title}
                        </h1>
                    </div>

                    {/* Book Container */}
                    <div className="flex-1 flex items-center justify-center w-full">
                        <div className="w-full flex flex-col items-center h-full justify-center" style={{gap: 'clamp(1.25rem, 0.75vh, 0.375rem)'}}>
                            <Book3DDisplay
                                currentPage={currentPageData}
                                story={currentStory}
                                imageUrl={imageUrl}
                                textPosition={textPosition}
                                words={words}
                                highlightedWords={highlightedWords}
                            />

                            <AudioProgressDisplay
                                progress={audioProgress}
                                isPlaying={isPlaying}
                                isCountingDown={isCountingDown}
                                countdown={countdown}
                            />

                            <div
                                className="flex flex-col md:flex-row justify-between items-center"
                                style={{
                                    marginTop: 'clamp(0.5rem, 1.5vh, 0.75rem)',
                                    gap: 'clamp(0.5rem, 1.5vh, 0.75rem)'
                                }}
                            >
                                <PlaybackControls
                                    isPlaying={isPlaying}
                                    canGoNext={canGoNext}
                                    canGoPrevious={canGoPrevious}
                                    isFlipping={isFlipping}
                                    onTogglePlayPause={handleTogglePlayPause}
                                    onNext={handleNextPage}
                                    onPrevious={handlePreviousPage}
                                />

                                <PageNavigationButtons
                                    textPosition={textPosition}
                                    onToggleTextPosition={toggleTextPosition}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
