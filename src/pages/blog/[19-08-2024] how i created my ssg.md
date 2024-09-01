---
title: how i created my ssg!
description: built my own static site generator, wrestled with markdown, scss, and xml—turned chaos into something kinda cool. here’s how it went down.
date: 19/08/2024 00:00:00
color: green

page-type: post

use-style: /style.scss
---

so the other day, i was on the nekoweb discord server, just chilling as usual. i mentioned to “chat” that my site was getting trickier and trickier to manage by the day, and a few people (max, tmhell, and giiki) suggested i use an ssg. one of the first they recommended was 11ty, an ssg with support for 11 markup languages. i’d used it in the past and was pretty comfortable with it.

HOWWWEVERRR, i wanted a challenge—something not too difficult to create, but just tricky enough to fit my needs.

the needs in question:
- markdown support
- a consistent layout
- easy metadata management
- scss support

so, i knew how i was gonna start: i installed a markdown library called ‘marked.’ it’s a simple tool that turns markdown into html. but metadata had me a little stumped… i could go with the traditional yaml method, or i could try something different. in the end, i went with xml because it allowed for perfect syntax highlighting in md files. for scss, i just used the sass library on npm and called it a day.

funny story: i was conflicted about file extensions. i started with xml and was like, “what the fuck, who makes a site in xml?” then i switched to html, but it didn’t have markdown syntax highlighting, so i finally just went with the classic md file extension.

the metadata setup was pretty cool. i had a root file that was basically a template with different parameters like commit hashes, titles, etc. that was really nice and handy…

but making my blog made the build code a little (okay, a shit ton) harder to read. but i’ll manage… eh… eventually?

for some context, i had made a previous ssg based off my kitty library, and… let’s just say it was so shit that i had to make a better one. like, i genuinely was not having that mess lol.

anyways, byeeeee
