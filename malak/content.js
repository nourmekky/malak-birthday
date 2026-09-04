/* =========================================================================
   WRITE YOUR MESSAGE HERE.
   This is the only file you need to touch. Save, then refresh the page.

   Arabic works. Just type it. Any paragraph written in Arabic flips itself
   to right to left automatically and switches to an Arabic serif face.
   You can mix: an English paragraph and an Arabic one in the same letter.
   ========================================================================= */

const CONTENT = {

  // Her name, on the envelope and in the page title.
  name: "Malak",

  // Small line at the very top of the letter.
  dateline: "For Malak, on her birthday",

  // The first line of the letter. Big type.
  // The word in "highlight" is set in italic rose inside that line.
  opening: "Happy birthday to Mimii, my favorite person and one of the best things that ever happened to me.",
  highlight: "Mimii",

  // The letter. Each string is one paragraph.
  // Add or remove as many as you like, just keep the commas between them.
  body: [
    "I honestly don’t know how to put into words how much you mean to me. You’re not just my best friend, you’re my safe place, the person I can be completely myself with, and someone I genuinely can’t imagine my life without.",
    "I’m so grateful for every laugh, every random conversation, every stupid moment, and even the hard days we’ve been through together. Somehow, having you in my life makes everything feel a little better.",
    "Malak, I hope you always know how loved you are, not just today but every single day. You deserve all the happiness, love, and beautiful things in this world. And no matter how much life changes, I hope you always know that you’ll have me by your side.",
    "I love you so much, Mimi. More than I can properly explain.",
    "Happy birthday to my favorite girl. I’m so lucky I got you. 😍😍♥️♥️♥️"
  ],

  // The one line you most want her to actually stop on. Set to "" to hide it.
  pullquote: "",

  // The roses. Swap in your own file if you want a different photo.
  rosePhoto: "photos/roses.jpg",
  roseCaption: "Because you love them.",

  // Optional photo of her. Drop a file in photos/ and put the name here.
  // Leave it as "" and this section simply does not appear.
  photo: "",
  photoCaption: "",

  // The wish.
  wishPrompt: "Close your eyes and make one.",
  wishButton: "Make a wish",
  wishReply: "It is already on its way.",

  // The end of the letter: her age and her birthday, then the signature.
  // The signature writes itself out letter by letter when she reaches it:
  // first the small line, then your name, with a pen stroke under it.
  age: "19",
  birthdate: "05 . 09 . 2007",
  from: "Your future husband,",
  signer: "Nour",

  // Music. Put your song file in the music/ folder and write its name here.
  // It starts the moment she opens the envelope (quietly, fading in), and
  // she can mute it with the small button in the corner. The line under
  // it shows next to that button. Set music to "" for no music.
  music: "music/lovesong.mp3",
  musicLine: "However far away, I will always love you",

  // Keep the envelope sealed until this moment (Cairo time, +03:00).
  // Before it, she sees a countdown. At midnight it unlocks by itself.
  // Set unlockAt to "" to let her open it straight away.
  // To check the letter yourself before then, open the link with ?preview
  // on the end, for example  https://your-link/?preview
  unlockAt: "",
  unlockLabel: "Opens on 5 September",
  unlockUnits: ["days", "hours", "minutes", "seconds"]
};


/* -------------------------------------------------------------------------
   ARABIC EXAMPLE
   Want it in Arabic instead? Delete the block above and rename this one
   from CONTENT_ARABIC to CONTENT. Edit the words to your own.

const CONTENT_ARABIC = {
  name: "ملك",
  dateline: "لملك، في عيد ميلادها",
  opening: "كل سنة وانتي طيبة يا ميمي",
  highlight: "ميمي",
  body: [
    "مش عارف أوصف انتي تعنيلي إيه. انتي مش بس أقرب صاحبة ليا، انتي المكان اللي بحس فيه بالأمان، والشخص اللي بقدر أكون نفسي معاه، واللي مش قادر أتخيل حياتي من غيره.",
    "شاكر لكل ضحكة، وكل كلام ملوش لازمة، وكل لحظة سخيفة، وحتى الأيام الصعبة اللي عدينا فيها سوا. وجودك في حياتي بيخلي كل حاجة أحلى.",
    "بحبك أوي يا ميمي. أكتر ما أقدر أشرح."
  ],
  pullquote: "",
  rosePhoto: "photos/roses.jpg",
  roseCaption: "علشان انتي بتحبيه.",
  photo: "",
  photoCaption: "",
  wishPrompt: "اقفلي عينيكي واتمني أمنية.",
  wishButton: "اتمني أمنية",
  wishReply: "الأمنية في طريقها ليكي.",
  age: "19",
  birthdate: "٠٥ . ٠٩ . ٢٠٠٧",
  from: "جوزك المستقبلي،",
  signer: "نور",
  music: "music/lovesong.mp3",
  musicLine: "مهما كنتي بعيدة، هفضل بحبك",
  unlockAt: "",
  unlockLabel: "بيتفتح يوم ٥ سبتمبر",
  unlockUnits: ["يوم", "ساعة", "دقيقة", "ثانية"]
};
------------------------------------------------------------------------- */
