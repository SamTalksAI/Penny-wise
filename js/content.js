/* Penny Wise – lesson text, quizzes and bonus questions.
   Activities (interactive games) live in app.js. */
window.PW_MODULES = [
  {
    id: 'needs', num: 1, title: 'Needs vs Wants', emoji: '🛒', color: '#9fd8bf',
    blurb: 'Sort things you need from things you want.',
    lessons: [
      { illus: '🏠 🥦 🧥 💧',
        html: `<h2>What is a need?</h2>
        <p>A <b>need</b> is something you must have to live safely and stay healthy.</p>
        <ul><li>💧 Water and healthy food</li><li>🏠 A home to live in</li><li>🧥 Clothes that keep you warm</li><li>💊 Medicine when you are sick</li><li>📓 Things you need for school</li></ul>
        <div class="keyidea"><b>Key idea:</b> Needs come first. They keep you safe, healthy and learning.</div>` },
      { illus: '🎮 🍬 🎟️ 🤖',
        html: `<h2>What is a want?</h2>
        <p>A <b>want</b> is something that is nice to have, but you can live without it.</p>
        <ul><li>🎮 A new video game</li><li>🍬 Candy</li><li>🎟️ A concert ticket</li><li>👟 A fourth pair of sneakers</li></ul>
        <p>Wants are not bad! Fun things make life happy. The trick is to <b>pay for needs first</b>, then plan for wants with the money that is left.</p>
        <div class="keyidea"><b>Tricky part:</b> Some things can be both. A coat is a need. A super-expensive designer coat is mostly a want!</div>` }
    ],
    activityTitle: 'Sorting game: Need or Want?',
    quiz: [
      { q: 'Which of these is a NEED?', options: ['A new video game', 'A warm coat for winter', 'A third pair of sneakers'], answer: 1,
        explain: 'A warm coat keeps you safe and healthy in cold weather, so it is a need. The others are nice to have.' },
      { q: 'Wants are…', options: ['Bad things you should never buy', 'Things that are nice to have, but you can live without', 'Things you need to stay healthy'], answer: 1,
        explain: 'Wants are fine to enjoy! Just plan for them after your needs are covered.' },
      { q: 'You have $10. Lunch costs $6 and a comic book costs $5. What is the smart move?', options: ['Buy the comic first, then hope for lunch', 'Buy lunch first, then save the $4 left toward the comic', 'Buy nothing at all and stay hungry'], answer: 1,
        explain: 'Needs first! Lunch costs $6, leaving $4. Save it, and next time you only need $1 more for the comic.' }
    ],
    bonus: { title: 'Camp shopping challenge', custom: 'campShop' }
  },
  {
    id: 'saving', num: 2, title: 'Saving Goals', emoji: '🐷', color: '#f4c2cf',
    blurb: 'Pick a goal and fill your piggy bank.',
    lessons: [
      { illus: '🐷 🪙 🪙 🪙',
        html: `<h2>Why save?</h2>
        <p><b>Saving</b> means keeping some money now so you can use it later.</p>
        <p>When you save, you can buy bigger things you could not afford in one week, like a bike 🚲 or a skateboard 🛹. Saving also helps if something surprising happens.</p>
        <div class="keyidea"><b>Key idea:</b> A <b>saving goal</b> is something you save for. It has a <b>price</b> and a <b>plan</b>.</div>` },
      { illus: '🎯 📅 🚲',
        html: `<h2>Make a plan</h2>
        <p>To find out how many weeks it takes, divide the price by how much you save each week:</p>
        <p class="big-num" style="text-align:center">$60 ÷ $10 = 6 weeks</p>
        <p>If it does not divide evenly, round <b>up</b>. Saving $4 a week for a $30 game: after 7 weeks you have $28 (not enough), so you need <b>8 weeks</b>.</p>
        <div class="keyidea"><b>Tip:</b> Save a little more each week and you reach your goal faster!</div>` }
    ],
    activityTitle: 'Virtual piggy bank',
    quiz: [
      { q: 'A bike costs $60. You save $10 each week. How many weeks until you can buy it?', options: ['5 weeks', '6 weeks', '10 weeks'], answer: 1,
        explain: '$60 ÷ $10 = 6. After 6 weeks you have exactly $60.' },
      { q: 'A game costs $30. You save $4 each week. How many weeks do you need?', options: ['7 weeks', '7 and a half weeks', '8 weeks'], answer: 2,
        explain: '$30 ÷ $4 = 7.5. After 7 weeks you only have $28, so you need an 8th week. Always round up!' },
      { q: 'What helps you reach a saving goal faster?', options: ['Saving a bit more each week', 'Looking at your piggy bank more often', 'Choosing a goal without checking its price'], answer: 0,
        explain: 'The more you save each week, the fewer weeks you need.' }
    ],
    bonus: { title: 'Head start puzzle', intro: 'Some savers start with money already in the piggy bank. Can you work these out?',
      questions: [
        { q: 'You already have $12 saved. You save $6 every week. The bike costs $60. How many weeks until you can buy it?', answer: 8, unit: 'weeks',
          explain: 'You still need $60 − $12 = $48. Then $48 ÷ $6 = 8 weeks.' },
        { q: 'Your friend starts with $0 and saves $5 a week for the same $60 bike. How many MORE weeks does your friend need than you?', answer: 4, unit: 'weeks',
          explain: 'Your friend needs $60 ÷ $5 = 12 weeks. You need 8. 12 − 8 = 4 more weeks. A head start helps!' }
      ] }
  },
  {
    id: 'budget', num: 3, title: 'Budgeting Jars', emoji: '🫙', color: '#f8cfae',
    blurb: 'Split $20 into Spend, Save and Share.',
    lessons: [
      { illus: '🧾 ✏️ 💵',
        html: `<h2>What is a budget?</h2>
        <p>A <b>budget</b> is a plan for your money. You decide <b>before</b> you spend where each dollar will go.</p>
        <p>One easy way is to use three jars:</p>
        <ul><li>🛍️ <b>Spend</b>: for small things you buy soon</li><li>🐷 <b>Save</b>: for goals later</li><li>💜 <b>Share</b>: to give to a cause or help someone</li></ul>` },
      { illus: '1️⃣ 🐷  2️⃣ 💜  3️⃣ 🛍️',
        html: `<h2>Pay yourself first</h2>
        <p>Smart savers fill the <b>Save jar first</b>, before spending. This is called <b>“pay yourself first”</b>.</p>
        <p>A simple starting rule: put <b>at least 10%</b> into Save. 10% of $20 is <b>$2</b>. Many people save even more!</p>
        <div class="keyidea"><b>Remember:</b> Your three jars must add up to your whole allowance. You cannot spend the same dollar twice!</div>` }
    ],
    activityTitle: 'Fill your jars ($20 allowance)',
    quiz: [
      { q: 'What is a budget?', options: ['A plan for how you will use your money', 'A type of bank', 'A list of things you already bought'], answer: 0,
        explain: 'A budget is a plan you make before you spend.' },
      { q: '“Pay yourself first” means…', options: ['Buy yourself a treat first', 'Put money in your Save jar before you spend', 'Pay back your friends first'], answer: 1,
        explain: 'You save first, so saving does not get forgotten after spending.' },
      { q: 'You get $20 and save 10% of it. How much goes into your Save jar?', options: ['$1', '$2', '$10'], answer: 1,
        explain: '10% means 10 out of every 100. 10% of $20 = $20 ÷ 10 = $2.' }
    ],
    bonus: { title: 'Percent power', intro: 'Mia gets <b>$25</b> a week. She saves <b>40%</b>, shares <b>10%</b> and spends the rest.',
      questions: [
        { q: 'How much does Mia put in her Save jar each week?', answer: 10, unit: '$', explain: '40% of $25 = 0.40 × 25 = $10.' },
        { q: 'How much goes in her Share jar?', answer: 2.5, unit: '$', explain: '10% of $25 = $25 ÷ 10 = $2.50.' },
        { q: 'How much is left to spend?', answer: 12.5, unit: '$', explain: '$25 − $10 − $2.50 = $12.50 (that is 50%).' },
        { q: 'If she keeps this up, how much is in her Save jar after 6 weeks?', answer: 60, unit: '$', explain: '$10 × 6 weeks = $60.' }
      ] }
  },
  {
    id: 'interest', num: 4, title: 'Compound Interest', emoji: '📈', color: '#a9cdee',
    blurb: 'Watch money grow like a snowball.',
    lessons: [
      { illus: '🏦 ➕ 🪙',
        html: `<h2>What is interest?</h2>
        <p>When you keep money in a savings account, the bank uses it and pays you a little extra. That extra money is called <b>interest</b>.</p>
        <p>The <b>interest rate</b> tells you how much. At 5% a year, $100 earns $5 in one year, so you have <b>$105</b>.</p>
        <div class="keyidea"><b>Fun fact:</b> If you borrow money (a loan or a credit card), it works the other way: <b>you</b> pay interest to the bank!</div>` },
      { illus: '⛄ ❄️ ❄️ ❄️',
        html: `<h2>The snowball effect</h2>
        <p><b>Compound interest</b> means you also earn interest on your interest. Like a snowball rolling downhill, it gets bigger faster and faster.</p>
        <p>$100 at 10% a year:<br>Year 1: $100 + $10 = <b>$110</b><br>Year 2: $110 + $11 = <b>$121</b> (the extra $1 is interest on interest!)</p>
        <div class="keyidea"><b>Secret ingredient:</b> TIME. Starting early gives your snowball more years to grow.</div>
        <p class="muted" style="font-size:.9rem">Real rates change over time. Savings accounts are usually safe but grow slowly. Investments can grow more, but they can also go down.</p>` }
    ],
    activityTitle: 'Money growth lab',
    quiz: [
      { q: 'You put $100 in an account that pays 10% a year. After 1 year you have…', options: ['$100', '$110', '$200'], answer: 1,
        explain: '10% of $100 is $10. $100 + $10 = $110.' },
      { q: 'You leave it there one more year at 10% (compound interest). Now you have…', options: ['$120', '$121', '$110'], answer: 1,
        explain: 'This year you earn 10% of $110 = $11. $110 + $11 = $121. You earned interest on your interest!' },
      { q: 'Sam starts saving at age 10. Alex starts at age 20. Same amount, same rate. Who will probably have more at age 30?', options: ['Sam', 'Alex', 'They will have the same'], answer: 0,
        explain: 'Sam’s money has 10 more years to grow. With compound interest, time makes a big difference.' }
    ],
    bonus: { title: 'Rule of 72', intro: 'Here is a money shortcut grown-ups use: <b>72 ÷ interest rate ≈ years to double your money</b>. At 9%, 72 ÷ 9 = 8, so money doubles in about 8 years.',
      questions: [
        { q: 'At 8% a year, about how many years does it take to double your money?', answer: 9, tol: 1, unit: 'years',
          explain: '72 ÷ 8 = 9 years. Check it in the Play lab: $100 at 8% for 9 years grows to $199.90, almost exactly double!' },
        { q: 'You put $200 in an account at 5% compound interest. How much do you have after 2 years?', answer: 220.5, unit: '$',
          explain: 'Year 1: $200 + $10 = $210. Year 2: $210 + $10.50 = $220.50.' }
      ] }
  },
  {
    id: 'shopping', num: 5, title: 'Smart Shopping & Scams', emoji: '🕵️', color: '#cfc3ec',
    blurb: 'Find the best deal and spot tricks.',
    lessons: [
      { illus: '🏷️ ⚖️ 🧃',
        html: `<h2>Compare the unit price</h2>
        <p>Bigger packs are not always cheaper! To compare, find the <b>unit price</b>: the price of <b>one</b> item, or one liter, or 100 grams.</p>
        <p class="big-num" style="text-align:center;font-size:1.4rem">Unit price = price ÷ amount</p>
        <p>4 granola bars for $2.00 → $2.00 ÷ 4 = <b>$0.50 each</b><br>10 granola bars for $6.00 → $6.00 ÷ 10 = <b>$0.60 each</b></p>
        <p>The small pack is the better deal here!</p>` },
      { illus: '🚩 🎣 💎',
        html: `<h2>Spot the tricks</h2>
        <ul><li>🚩 <b>Too good to be true?</b> “FREE phone! Just pay shipping with a card.” That is usually a <b>scam</b>.</li>
        <li>⏰ <b>Hurry pressure:</b> “Only 2 minutes left!” Scammers rush you so you do not think.</li>
        <li>🔑 <b>Never share</b> passwords, codes or card numbers, even with someone who says they are a friend or a game company.</li>
        <li>💎 <b>In-app purchases:</b> gems, coins and skins in games cost <b>real money</b>. Always ask a grown-up first.</li></ul>
        <div class="keyidea"><b>Golden rule:</b> If something online feels strange, stop and talk to a trusted grown-up.</div>` }
    ],
    activityTitle: 'Deal detective & scam spotter',
    quiz: [
      { q: 'Which is the better deal?', options: ['Pack A: 4 granola bars for $2.00', 'Pack B: 10 granola bars for $6.00', 'They cost the same per bar'], answer: 0,
        explain: 'Pack A: $2.00 ÷ 4 = $0.50 per bar. Pack B: $6.00 ÷ 10 = $0.60 per bar. Pack A wins!' },
      { q: 'A pop-up says: “You WON a free tablet! Enter your parent’s card number to pay $1 shipping.” What should you do?', options: ['Enter the card number fast before it expires', 'Close it and tell a grown-up: it is probably a scam', 'Send it to friends so they can win too'], answer: 1,
        explain: 'Prizes you never entered + asking for card details + hurry = scam red flags. Close it and tell a grown-up.' },
      { q: 'In a game, 500 gems cost $4.99. Gems are…', options: ['Free pretend money', 'Bought with real money, so always ask a parent first', 'Not important, so it is fine to buy lots'], answer: 1,
        explain: 'Game currencies hide the real price. 500 gems = almost $5 of real money!' }
    ],
    bonus: { title: 'Deal detective pro', intro: 'Use unit prices and careful thinking. Pick the best answer.',
      mc: [
        { q: 'Notebooks: 3 for $4.50 or 5 for $8.00. Which costs less per notebook?', options: ['3 for $4.50', '5 for $8.00', 'Same price'], answer: 0,
          explain: '$4.50 ÷ 3 = $1.50 each. $8.00 ÷ 5 = $1.60 each. The 3-pack is cheaper per notebook.' },
        { q: 'You need exactly 3 pens. Each pen costs $3. Offer A: “Buy 2, get 1 free.” Offer B: “25% off everything.” Which is cheaper?', options: ['Offer A', 'Offer B', 'Same price'], answer: 0,
          explain: 'A: pay for 2 pens = $6. B: 3 × $3 = $9, minus 25% ($2.25) = $6.75. Offer A saves more.' },
        { q: 'A game sells 500 gems for $4.99 or 1,200 gems for $9.99. The game says the big pack is “BEST VALUE!”. What is the smartest thought?', options: ['The big pack is cheaper per gem, so I should buy it right now', 'It is cheaper per gem, but only a good deal if I really need that many gems, and a parent agrees', 'Gems are free so it does not matter'], answer: 1,
          explain: 'Per 100 gems: $0.83 vs $1.00, so the big pack has a lower unit price. But spending more on something you do not need is not a deal!' }
      ] }
  }
];

window.PW_PARENT_TIPS = {
  needs: ['Next time you shop together, ask: “Is this a need or a want?” Let your child explain why.', 'Share one want you chose to wait for, and how it felt to wait.'],
  saving: ['Help your child choose a real goal and write its price on a sticky note on their piggy bank or jar.', 'Older kids: consider a small “matching” bonus (e.g. you add $1 for every $5 saved) to show how employer matching works.'],
  budget: ['If your child gets an allowance, try physical Spend / Save / Share jars for a month.', 'Let them make small mistakes with Spend money: a regretted $3 purchase is a cheap lesson.'],
  interest: ['Show a real savings account statement and find the interest line together.', 'For 12–13 year olds: explain that loans and credit cards charge interest, so compounding can also work against you.'],
  shopping: ['Compare unit prices on shelf labels at the supermarket together. Many stores print them.', 'Agree on a family rule for in-app purchases and online offers (e.g. “always ask first, never share passwords or codes”). Consider turning on purchase approval on devices.']
};
