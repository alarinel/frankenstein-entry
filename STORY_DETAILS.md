## Inspiration

I write a lot of books...

Or at least I used to. Novels. Horror was my favorite genre, and I spent many sleepless nights plugging away on my mechanical keyboard (the ones that don't have that comforting clang give me the chills!) to finish pulling a story from my brain to drop onto the page before it was lost to the ether.

Then life got to me and I slowed down and focused on my real job plugging away at boring monolithic corporate repositories to make a webpage load faster or convert from jsp to react. I still get my creative side out sometimes, but usually its writing some code for a game I'm working on and less on telling stories.

This, though, solves both issues simultaneously! I get to design something a little bit crazy to throw out my creative side and it integrates directly with my writer side of creating books.

Win win!

## What it does

It integrates with ten different APIs (unfortunately only 7 of them are free) to build a story for the reader. You pick various details to configure your story and let it loose and it will build out a children's book that you can interact with on the screen with visuals and audio!

## How we built it

Kiro! I designed it with Kiro's help and using a few technologies I actually know how to use and let Kiro loose to do the rest. My guidance was often as simple as pointing Kiro in the right direction (I know what it SHOULD look like in the code, I just don't have the hours to put in trying to get it that way!) but it was actually kind of surprising how easily it all came together.

## Challenges we ran into

There were a couple of times where we got into an argument, Kiro and me. I would say "fix this component to do this" and it would do it's little thing, beep boop, and say "Well that was super easy, barely an inconvenience, and now your component does that thing."

Except.

It didn't. Not even close. Sometimes it would literally just remove it entirely from the screen. 

I'm not ashamed to admit that a few times I used the dreaded ALL CAPPS messaging style to get through to Kiro. "This is what you did wrong. You aren't even looking at the right code! Now GO BACK TO THE DRAWING BOARD and FIX it."

Funnily enough, that sometimes works. Though, a few times I think it actually just made things worse to spite me. 

## Accomplishments that we're proud of

Got it working. That's the thing about building anything with so many moving parts (especially with external apis) because one domino falls and it all comes crashing down. I've been plugging away at code for long enough to generally know the pitfalls that Kiro might neglect, so I was able to keep it on a good trajectory.

## What we learned

A lot about Kiro. I have used Cursor, Qodo, Tabnine, Claude Code, Github Copilot, and a few other tools in my time. This was definitely similar to cursor in many ways, but there were a few things I really appreciated about this system over others I have tried.

The hooks were easy to set up, agent steering was a must (I actually have developed my own crazy convoluted system in other tools to do essentially this, so having it configurable off to bat and so easy was a truly amazing experience) and the hooks were a clever and novel idea to keep things going the right direction.

I have some basic MCPs I always use, but I was curious how well Kiro would do setting them up for me. Spoiler, three of them were crazy easy to set up and one of them was a nightmare because Kiro was CONVINCED that it knew how to configure it, except it didn't exist in the repo it tried to use. 

We got there in the end, though.

## What's next for Frankenbook

So this was just a fun little project for me, but honestly I had so much fun with it and it came out so well that I am probably going to finish turning it into a real life tool people can use in the real world. It will probably be done fairly soon and live to use in the real world, or maybe it will disappear into the backlog of: "I'll finish this later" projects I have sitting in repos over the years that I am too scared to look at now. Either way, it was really fun to create.