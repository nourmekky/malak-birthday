# A birthday site for Malak

The finished one is the **`malak`** folder. Send her that.
`01-letter`, `02-night` and `03-poster` are the earlier drafts, kept for reference.

Open `index.html` in this folder to preview everything.

## Writing your message

Open `malak/content.js` in any text editor. That is the only file you need to
touch. Change the words between the quote marks, save, refresh the page.
Every field has a comment above it explaining what it does.

What is already set:

- her name is **Malak**, and the letter opens with **Mimii** in rose
- her date is **05 . 09 . 2007**, and the big number is **19**
- it is signed **Your future husband**

## Arabic

Just type in Arabic and it handles itself. Any paragraph written in Arabic
flips to right to left and switches to an Arabic serif face. You can mix an
English paragraph and an Arabic one in the same letter.

There is a full Arabic version already written at the bottom of
`malak/content.js`, commented out. To use it, delete the English block and
rename `CONTENT_ARABIC` to `CONTENT`.

## Photos

The red roses are already in `malak/photos/`, cut from the bouquet picture.

To add a picture of her: drop the file into `malak/photos/` and put its name
in the `photo` field in `content.js`, for example `"photos/malak.jpg"`.
Leave that field empty and the section simply does not appear.
Portrait photos look best, around 900 by 1125 pixels.

## What is on the page

1. A sealed envelope with a rose wax seal. She taps it to open.
2. The opening line, with her nickname set in rose italic.
3. The letter, with a drop cap on the first paragraph.
4. The roses, set wider than the text.
5. **Make a wish.** She presses it, rose petals fall down the screen,
   and your reply appears.
6. Her age and her date, with a rose beside them.
7. Signed "Your future husband".

A thin red line across the top fills up as she reads.

## Putting it online

- **Netlify Drop.** Go to app.netlify.com/drop and drag the `malak` folder onto
  the page. You get a link straight away.
- **Vercel.** Run `npx vercel` inside the `malak` folder.
- **GitHub Pages.** Push the folder and turn on Pages in the repo settings.

Send her the link to `malak`, not this whole folder.

## Notes

- Mobile first, tested from 320px up to desktop.
- Respects the phone's reduce motion setting, so the petals and the reveals
  turn themselves off for anyone who has that switched on.
- Fonts are Cormorant Garamond, Jost, and Amiri for Arabic. They load from
  Google Fonts, so the page needs a connection the first time.
