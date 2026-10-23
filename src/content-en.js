// English text of the info pages (src/legal.js) and articles (src/articles.js),
// shown on the /en pages. Same block format and keys; anything missing here
// falls back to the Arabic. Keep facts in step with the Arabic versions.

export const INFO_PAGES_EN = {
  sell: {
    title: "Sell your car for free in the UAE",
    short: "Sell your car",
    description: "Sell your used car in the UAE for free on CarsUAE: post your ad with photos and price in a minute, and buyers contact you directly on WhatsApp or by phone.",
    body: [
      ["p", "Want to sell your car? On CarsUAE you post your ad for free in a minute, and buyers contact you directly, with no middleman and no commission."],
      ["cta", { text: "Ready? Post your ad now, for free.", href: "#sell", label: "Sell your car" }],

      ["h2", "Why sell on CarsUAE?"],
      ["ul", [
        "Completely free: no listing fee and no commission on the sale.",
        "Direct contact: buyers message you on WhatsApp or call you straight from the ad.",
        "Your ad reaches more people: we may also share it on CarsUAE's Instagram, TikTok and Facebook accounts.",
        "Your ad shows up on Google: every car gets its own page with photos and specs.",
        "You stay in control: change the price, mark it «Sold», or delete it at any time.",
      ]],

      ["h2", "How to post your ad in 4 steps"],
      ["ol", [
        "Sign in with your email or Google account.",
        "Tap «Sell your car», choose the make, model and year, and enter the mileage, price, emirate and specs.",
        "Add photos of the car (up to 8). The site automatically checks that the photos show a car.",
        "Enter your phone number and tap publish. Your ad goes live straight away.",
      ]],

      ["h2", "Tips to sell faster"],
      ["ul", [
        "Photograph the car clean and in daylight: front, back, both sides, the interior, and the dashboard with the engine running so the mileage shows.",
        "Set a price close to the market. Look at similar cars on the site before you decide.",
        "If the price is negotiable, turn on the «Negotiable» option. It brings more enquiries.",
        "Describe the car honestly: service history, any accidents, and anything that has been changed. Honesty saves you time with buyers who aren't serious.",
        "Reply to messages quickly. The first hours after posting matter most.",
      ]],
      ["tip", "If you lower the price after posting, the site shows buyers that the price has dropped, which draws attention to your ad."],

      ["h2", "How long your ad stays up"],
      ["p", "Your ad stays up for 30 days. In the last week a renew button appears in «My listings» so you can extend it for another 30 days. When the car is sold, tap «Sold» and the ad disappears."],

      ["cta", { text: "Post your car now. It takes a minute.", href: "#sell", label: "Start selling" }],
    ],
  },

  faq: {
    title: "Frequently asked questions",
    short: "FAQ",
    description: "Answers to the most common questions about CarsUAE: is posting free, how long an ad stays up, how to edit or delete your ad, how to contact a seller, and how to report a bad ad.",
    body: [
      ["h2", "For sellers"],
      ["faq", [
        ["Is posting an ad free?", "Yes. Posting an ad on CarsUAE is completely free, and we take no commission on the sale."],
        ["How do I post my car?", "Sign in with your email or Google account, tap «Sell your car», fill in the car's details, add photos, then tap publish."],
        ["How many photos can I add?", "Up to 8 photos per ad. The site rejects photos that don't show a car."],
        ["How long does an ad stay up?", "30 days. In the last 7 days a renew button appears in «My listings» so you can extend it for another 30 days."],
        ["How do I change the price or details?", "Go to «My listings» and tap the edit button on the ad. If you lower the price, buyers see that the price has dropped."],
        ["I sold the car. What now?", "Go to «My listings» and tap «Sold». The ad disappears from the site, and you can delete it completely if you like."],
        ["Is my phone number shown publicly?", "Yes, your phone number appears on the ad so buyers can call you or message you on WhatsApp. Your email is never shown."],
      ]],
      ["h2", "For buyers"],
      ["faq", [
        ["Do I need an account to browse?", "No. You can browse every car and contact sellers on WhatsApp without an account. You only need one to save favourites or post an ad."],
        ["Does CarsUAE sell cars itself?", "No. CarsUAE is a listings platform. The deal is directly between you and the seller, so contact them from the ad."],
        ["How can I make sure the car is in good condition?", "Check the VIN for free on our «VIN check» page, and take the car to an approved inspection centre before you pay. See also our article on inspecting a used car before buying."],
        ["What does «Verified dealer» mean?", "It's a badge we give to brokers and showrooms we have worked with and checked. As with any deal, still inspect the car and its papers yourself."],
        ["I found a suspicious ad. What should I do?", "Tap «Report» on the ad and choose a reason. An ad that gets several reports is hidden automatically until we review it."],
      ]],
      ["h2", "Your account"],
      ["faq", [
        ["I didn't get the confirmation email.", "Check your spam folder. You can also tap «Resend» in the sign-up window, or sign in with Google, which needs no email confirmation."],
        ["How do I delete my account?", "Write to us from the «Contact us» page using your registered email, and we will delete your account and ads."],
      ]],
      ["cta", { text: "Didn't find your answer?", href: "/contact", label: "Contact us" }],
    ],
  },

  safety: {
    title: "Safety tips and avoiding scams",
    short: "Safety tips",
    description: "How to protect yourself when buying or selling a used car in the UAE: signs of fake ads, paying safely, viewing the car, and transferring ownership without problems.",
    body: [
      ["p", "Most buyers and sellers are honest, but like any market, some people try to scam. These tips protect you whether you're buying or selling."],

      ["h2", "Signs of a fake ad"],
      ["ul", [
        "The price is far below the market for no clear reason.",
        "The seller is «travelling» or «outside the country» and wants to ship the car after you transfer money.",
        "They ask for a deposit or any payment before you see the car.",
        "They refuse calls or viewings and want everything done by message.",
        "They pressure you: «Other people want it, transfer now».",
        "The photos look copied from the internet, or don't match the car you see.",
      ]],
      ["tip", "The golden rule: never transfer any money before you have seen the car with your own eyes and checked its papers."],

      ["h2", "Tips for buyers"],
      ["ul", [
        "View the car in a public place in daylight, and take someone with you if you can.",
        "Make sure the name on the registration (mulkiya) matches the seller, or that they hold an official power of attorney.",
        "Check the VIN and match it with the registration card and with the number on the car itself.",
        "Ask whether the car has a bank loan on it or unpaid fines.",
        "Have the car inspected at an approved centre before you pay.",
        "Pay the full amount at the time of the ownership transfer, ideally by bank transfer so there is proof of payment.",
      ]],
      ["cta", { text: "Check the VIN for free before the viewing.", href: "/vin-check", label: "VIN check" }],

      ["h2", "Tips for sellers"],
      ["ul", [
        "Watch out for a «buyer» who wants to pay more than the price and asks you to send back the difference.",
        "Don't send full photos of your registration or Emirates ID to anyone before you have agreed the sale.",
        "Don't hand over the car or the keys until the full amount has reached your account.",
        "Don't tap strange links that claim to be a «payment» or «sale confirmation».",
        "Do the ownership transfer yourself with the buyer at a service centre or through the official app, and take the car off your insurance after the sale.",
      ]],

      ["h2", "If you come across a scam"],
      ["ul", [
        "Tap «Report» on the ad, or write to us from the contact page, and we will review the ad quickly.",
        "If you lost money, report it to the police right away through the official channels in your emirate, and call your bank to try to stop the transfer.",
      ]],
      ["cta", { text: "Seen a suspicious ad?", href: "/contact", label: "Tell us" }],
    ],
  },

  dealers: {
    title: "For brokers and car ad accounts: a free partnership with CarsUAE",
    short: "For dealers & brokers",
    description: "Do you run a car ads account in the UAE? We post your clients' ads for free on CarsUAE and our Instagram, Facebook and TikTok accounts, and every ad says it came from your account.",
    body: [
      ["p", "Do you have an Instagram account where you post car ads for your clients? Every ad you post on your page can also go on the CarsUAE website and our accounts for free, credited to your account."],

      ["h2", "What you get"],
      ["ul", [
        "Every ad carries the line «📢 Ad from the account» with your account name and link: free promotion for you in every ad.",
        "Your clients get more exposure: your page, carsuae.net, and CarsUAE's Instagram, Facebook and TikTok accounts.",
        "Your clients' cars reach more buyers and sell faster, so they come back to you.",
        "A page on the site in your account's name that gathers all your ads.",
        "Every car gets its own page that shows up on Google.",
        "The car owner's number is shown on the ad, and buyers contact them directly.",
        "No fees, subscription or commission for you.",
      ]],

      ["h2", "How it works: pick what suits you"],
      ["ol", [
        "Send us the post link on WhatsApp after you post it on your page, and we put it up.",
        "Or do nothing: we take the ads straight from your account, with photos and details, and post them.",
      ]],
      ["tip", "Once each ad is live we send you its link. If the car sells or the price changes, tell us and we update it."],

      ["h2", "How to start"],
      ["ol", [
        "Message us from the contact page or on WhatsApp with your Instagram account name.",
        "We set up your own page on the site.",
        "We start posting your ads right away.",
      ]],
      ["cta", { text: "Want to show your cars on CarsUAE?", href: "/contact", label: "Contact us" }],
    ],
  },

  about: {
    title: "About us",
    short: "About us",
    description: "CarsUAE is a used car marketplace for the UAE, in Arabic and English: free listings, direct contact between seller and buyer, and tools that help you buy with confidence.",
    body: [
      ["p", "CarsUAE (carsuae.net) is an online marketplace for used cars in the United Arab Emirates, built in Arabic from the start and now in English too. Our aim is simple: make it easy for people to buy and sell their cars, with no hassle and no fees."],

      ["h2", "What makes us different"],
      ["ul", [
        "Arabic and English: the whole site works in both languages.",
        "Free: posting an ad is free, and we take no commission on the sale.",
        "Direct contact: buyers talk to sellers on WhatsApp or by phone, with no middleman.",
        "Simple: post your car from your phone in a minute.",
        "Helpful tools: a free VIN check, plus articles and tips before you buy.",
        "We protect the market: we review reports, and ads that break the rules are removed.",
      ]],

      ["h2", "Where we cover"],
      ["p", "We list cars from every emirate: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah and Al Ain, and you can filter by emirate, make, price, year and mileage."],

      ["h2", "Get in touch"],
      ["p", "Have a suggestion or a comment? We'd love to hear from you."],
      ["cta", { text: "Write to us any time.", href: "/contact", label: "Contact us" }],
    ],
  },

  terms: {
    title: "Terms and conditions",
    short: "Terms",
    description: "Terms of use for CarsUAE, the UAE used car marketplace: posting ads, the responsibilities of sellers and buyers, allowed content, and the limits of the site's liability.",
    body: [
      ["p", "Welcome to CarsUAE (carsuae.net). By using the site or posting an ad on it, you agree to these terms. If you do not agree, please do not use the site. These terms are also published in Arabic; if the two versions differ, the Arabic version prevails."],

      ["h2", "1. What CarsUAE is"],
      ["p", "CarsUAE is an online listings platform that brings together sellers and buyers of used cars in the United Arab Emirates. The site does not buy or sell cars and is not a party to any deal between a seller and a buyer. Our role is only to show the ads and make contact easier."],

      ["h2", "2. Your account"],
      ["ul", [
        "You need an account (email or Google) to post an ad or save cars to your favourites.",
        "You are responsible for the accuracy of your details, for protecting your password, and for any activity on your account.",
        "You must be 18 or older to post an ad.",
      ]],

      ["h2", "3. Posting ads"],
      ["ul", [
        "Posting an ad is free.",
        "You must own the car or be officially authorised to sell it.",
        "The ad's information must be correct: make, model, year, mileage, price, specs and condition.",
        "The photos must be of the actual car for sale.",
        "The phone number in the ad is shown to users so they can contact you, and you agree to this when you post.",
        "An ad stays up for 30 days and can be renewed before it ends. You can mark it «Sold» or delete it at any time.",
        "We may post ads in coordination with brokers or car owners with their consent; these show the car owner's number.",
      ]],

      ["h2", "4. Prohibited content"],
      ["ul", [
        "Fake ads, or ads for cars that don't exist or aren't owned by the advertiser.",
        "Misleading information about the car's condition, history or mileage.",
        "Stolen cars, or cars with a legal bar on sale, without saying so.",
        "Any content that breaks UAE law, is offensive or infringes others' rights, including photos copied from other people's ads without permission.",
        "Using the site to harvest users' data or send spam.",
      ]],
      ["p", "We may edit, hide or delete any ad, or suspend any account, if we believe it breaks these terms, without prior notice. An ad that receives several reports is hidden automatically until it is reviewed."],

      ["h2", "5. Responsibilities of sellers and buyers"],
      ["ul", [
        "A deal is a direct agreement between the seller and the buyer, who are responsible for checking the car, the papers, the price, the payment method and the ownership transfer.",
        "We advise buyers to have the car inspected at an approved centre before buying, and not to pay anything before viewing the car.",
        "CarsUAE does not guarantee the accuracy of ads or the condition of cars, and is not responsible for any dispute or loss arising from a deal between users.",
      ]],

      ["h2", "6. The VIN check tool and articles"],
      ["p", "The VIN check tool and the articles on the site are for general information only. VIN data comes from external databases and may be incomplete or inaccurate for some cars; it does not replace an inspection at an approved centre or a check with the dealer."],

      ["h2", "7. Intellectual property"],
      ["p", "The site's design, logo and text belong to CarsUAE. By posting an ad, you allow us to show its photos and content on the site and on our social media accounts to promote it, and you confirm that you have the right to use those photos."],

      ["h2", "8. Limitation of liability"],
      ["p", "We provide the site «as is». We try to keep it available and free of errors, but cannot always guarantee that. To the extent permitted by law, CarsUAE is not liable for any direct or indirect damage arising from using the site or relying on its content."],

      ["h2", "9. Changes to these terms"],
      ["p", "We may change these terms from time to time and will publish the updated version on this page with its date. Continuing to use the site after a change means you accept the new terms."],

      ["h2", "10. Governing law"],
      ["p", "These terms are governed by the laws of the United Arab Emirates."],

      ["cta", { text: "Have a question about the terms?", href: "/contact", label: "Contact us" }],
    ],
  },

  privacy: {
    title: "Privacy policy",
    short: "Privacy policy",
    description: "How CarsUAE collects, uses and protects your data: your account, ads, phone number, visit statistics and outside services, and your rights to access and deletion.",
    body: [
      ["p", "Your privacy matters to us. This page explains what data CarsUAE (carsuae.net) collects, why, who we share it with, and how you can control it. This policy is also published in Arabic; if the two versions differ, the Arabic version prevails."],

      ["h2", "1. Data we collect"],
      ["ul", [
        "Account data: your email, and your name if you sign in with Google. Your password is stored encrypted and we cannot see it.",
        "Ad data: the car's details, photos, price, emirate, the seller's name and phone number.",
        "Your activity on the site: the cars you save to favourites and the reports you send about ads.",
        "Visit statistics: we record the page you visited and where you came from (such as Instagram, Google or a direct link), without your name or IP address, to count visits and views of each ad.",
        "Technical data: our hosting providers may log ordinary technical data (such as IP address and browser type) to run and protect the site.",
      ]],

      ["h2", "2. What is shown publicly"],
      ["ul", [
        "The ad's details, photos and the seller's name are visible to all visitors.",
        "Your phone number appears on the ad so buyers can call you or message you on WhatsApp.",
        "We may also share your ad on CarsUAE's Instagram, Facebook and TikTok accounts.",
        "Your email is never shown to anyone.",
      ]],

      ["h2", "3. Why we use your data"],
      ["ul", [
        "To run your account and show your ads and favourites.",
        "To send necessary messages such as email confirmation.",
        "To contact you about your ad.",
        "To review reports and protect the site from fake ads and fraud.",
        "To improve the site using visit statistics.",
      ]],
      ["p", "We don't sell your data to anyone, and we don't use it for third-party advertising."],

      ["h2", "4. Outside services we use"],
      ["ul", [
        "Supabase: to store accounts, ads and photos.",
        "Vercel: to host the site.",
        "Resend: to send confirmation emails.",
        "Google: when you choose to sign in with Google.",
        "The US NHTSA database: when you use the VIN check, only the VIN is sent to get the specs.",
      ]],
      ["p", "Some of these services store data on servers outside the UAE and follow their own data protection standards."],

      ["h2", "5. Browser storage"],
      ["p", "The site uses your browser's local storage (Local Storage and Session Storage) to keep you signed in and to avoid counting the same visit more than once. We don't use advertising trackers."],

      ["h2", "6. How long we keep data"],
      ["ul", [
        "Sold or expired ads disappear from the site, but we may keep a copy in the database for statistics and dispute resolution, unless you ask us to delete it.",
        "When you delete your ad yourself, the ad and its photos are removed from the database.",
        "We keep account data until you ask us to delete your account.",
      ]],

      ["h2", "7. Your rights"],
      ["p", "You can ask to see or correct your data, or to delete your account and ads, at any time by emailing us at the address below. We reply to requests as soon as we can."],

      ["h2", "8. Data protection"],
      ["p", "We use an encrypted connection (HTTPS) and permissions that stop any user from changing someone else's data. Even so, no method of sending or storing data online is 100% secure."],

      ["h2", "9. Changes to this policy"],
      ["p", "We may update this policy if the site's services change, and will publish the new version here with its date."],

      ["cta", { text: "Questions about your data, or want to delete your account?", href: "/contact", label: "Contact us" }],
    ],
  },

  contact: {
    title: "Contact us",
    short: "Contact us",
    description: "Contact the CarsUAE team: questions about ads, reporting a bad ad, data deletion requests, or partnerships with showrooms and brokers.",
    body: [
      ["p", "We'd love to hear from you. Write to us any time and we'll get back to you as soon as we can."],
      ["contact", null],

      ["h2", "You can contact us about"],
      ["ul", [
        "Help posting or editing your ad.",
        "Reporting a fake or rule-breaking ad (you can also tap «Report» on the ad itself).",
        "Asking to see your data or delete your account.",
        "Showrooms and brokers who want to list their cars on CarsUAE.",
        "Any suggestion to improve the site.",
      ]],
      ["tip", "CarsUAE doesn't sell cars itself. To ask about a specific car, contact the seller directly with the WhatsApp or call button on the ad."],
    ],
  },
};

export const ARTICLES_EN = {
  "sell-used-car-uae-guide": {
    title: "How to sell your used car fast and at a good price in the UAE",
    description: "A practical guide to selling your used car in the UAE: setting the right price, preparing the car, taking photos and writing the ad, and handling the bank loan and ownership transfer without headaches.",
    body: [
      ["p", "Want to sell your car without it sitting in the listings for months, and without selling it for less than it's worth? The secret isn't luck. It's four things: a sensible price, a clean car, clear photos and an honest ad. This guide walks you through it step by step, from day one to the day of the ownership transfer."],

      ["h2", "1. Get the price right first"],
      ["p", "The biggest reason a car doesn't sell is the price. Set it too high and people skip your ad. Set it far too low and you lose money, and buyers suspect something is wrong with the car."],
      ["ul", [
        "Look for cars like yours: same make, model and year, similar mileage, and the same specs (GCC or imported).",
        "Note the prices of five or six ads and take the middle, not the cheapest or the most expensive.",
        "Go a little higher if your car has low mileage, dealer warranty or a full service history. Go lower if it has repainted panels, an accident history or needs tyres.",
        "Leave a little room to negotiate. Most buyers in the UAE want to bargain, so don't start with your final price.",
      ]],
      ["cta", { text: "See prices of cars similar to yours before you set your price.", href: "/used-cars", label: "Compare prices" }],

      ["h2", "2. Get the papers ready now"],
      ["p", "A serious buyer asks about the papers before asking about the colour. Prepare them from the start so the sale doesn't stall at the last minute."],
      ["ul", [
        "The original registration card (mulkiya) and your Emirates ID.",
        "Service history: dealer or garage invoices. This is one of the strongest things for a buyer's trust.",
        "Pay any traffic fines, because ownership can't be transferred while fines are outstanding.",
        "If the car is more than three years old, it will usually need to pass a technical inspection before the transfer, unless it has a valid one. Check the current rules on the website of the RTA or the traffic authority in your emirate.",
      ]],

      ["h2", "3. Still paying a bank loan? Here's what to do"],
      ["p", "Many people sell cars that are still mortgaged to the bank. That's normal, but it takes a few steps. You can't transfer ownership while the mortgage is on the car."],
      ["ol", [
        "Call the bank and ask for the exact outstanding amount to settle the loan.",
        "Settle the loan yourself, or agree with the buyer that they pay the outstanding amount to the bank out of the car's price.",
        "Once it's settled, get a clearance letter from the bank to release the mortgage.",
        "Then go to a service centre to transfer the ownership.",
      ]],
      ["tip", "If the buyer is paying off the loan for you, make sure the payment goes directly to the bank with clear paperwork, and don't hand over the car until the payment is confirmed. Some banks also let the buyer take over the loan, so ask yours."],

      ["h2", "4. Clean the car and fix the small things"],
      ["p", "A clean car sells faster and for a better price, even in the same mechanical condition. First impressions count."],
      ["ul", [
        "A full wash inside and out; clean the carpets, the dashboard and the air vents.",
        "Remove all your personal things from the cabin and the boot.",
        "Fix the cheap things: a blown bulb, old wiper blades, a top-up of washer fluid.",
        "Make sure the air conditioning cools well. In the UAE it's the first thing a buyer tries.",
        "Don't hide any fault. If there's a problem, mention it openly or fix it. The buyer will inspect the car, and a hidden fault ruins trust and the whole sale.",
      ]],
      ["cta", { text: "Find out what a buyer will check so you can prepare your car first.", href: "/blog/used-car-inspection-checklist", label: "Inspection checklist" }],

      ["h2", "5. Photograph the car properly"],
      ["p", "Photos are what make a buyer stop while scrolling through ads. Dark or distant photos let your ad get lost among the others."],
      ["ul", [
        "Shoot in daylight, in the morning or before sunset, in an open spot with a tidy background. Avoid harsh midday sun, which causes reflections.",
        "Shoot from every side: front, back, both sides and the four corners.",
        "Shoot the inside: front and back seats, the dashboard with the mileage showing and the engine running, and the screen.",
        "A photo of the engine, the tyres and the boot.",
        "If there's a scratch or a repainted panel, photograph it. Honesty here saves you pointless calls.",
        "Wipe the lens before you shoot, and hold the phone sideways.",
      ]],

      ["h2", "6. Write a clear and honest ad"],
      ["p", "A good ad answers the buyer's questions before they call. You get fewer calls, but more serious ones."],
      ["ul", [
        "Give the basics: make, model, year, mileage, specs (GCC or imported), emirate and price.",
        "Describe the condition honestly: repainted panels, accidents, the last service, the tyres, and any warranty.",
        "Say why you're selling in one sentence, for example: I want a bigger car, or I'm leaving the country.",
        "Say whether the price is negotiable.",
        "Give a mobile number you will answer, ideally one with WhatsApp.",
      ]],
      ["tip", "Buyers can check the VIN themselves. Don't list specs that aren't true; it will come out and you'll lose the buyer."],

      ["h2", "7. Stay careful at the meeting and the sale"],
      ["ul", [
        "Meet the buyer in a public place in daylight, and bring someone with you if you can.",
        "On the test drive, stay in the car with the buyer, and check their licence first.",
        "Don't hand over the car or the registration until the full amount has arrived. A bank transfer at the time of the ownership transfer is safer than a lot of cash.",
        "Ignore messages that ask you to pay shipping fees or open strange links to receive the money.",
        "After the transfer, cancel or move your insurance on the car, and ask your insurer about any refund.",
      ]],

      ["cta", { text: "Is your car ready? Post your ad on CarsUAE for free and let buyers contact you directly.", href: "#sell", label: "Sell your car" }],
    ],
  },

  "used-car-inspection-checklist": {
    title: "Inspecting a used car before you buy: a complete step-by-step checklist",
    description: "Before you buy a used car in the UAE: what to check on the body, engine, gearbox and air conditioning, how to read a tyre's date, and why an inspection at an approved centre can save you thousands of dirhams.",
    body: [
      ["p", "Buying a used car can be the best deal you ever make, or the biggest mistake. The difference is often half an hour of checking before you pay. Here is a practical checklist to follow step by step, whether you're buying from a private seller or a showroom."],

      ["h2", "Before you go to see the car"],
      ["ul", [
        "Ask the seller for the VIN (chassis number) and a photo of the registration card, and ask: is there a bank loan or any fines on the car?",
        "Compare the price with similar cars (roughly the same model, year and mileage). A price far below the market deserves a question.",
        "Check the VIN to find the country of manufacture, model year and factory specs, and make sure they match the ad.",
        "Ask for the service history: dealer or garage invoices, or ask the dealer using the VIN.",
      ]],
      ["cta", { text: "Have the VIN? Check it for free before you go.", href: "/vin-check", label: "VIN check" }],

      ["h2", "Body and frame"],
      ["ul", [
        "Look at the car in daylight, not at night or under a shade. A slight colour difference between panels usually means repainting.",
        "Check the gaps between the doors, bonnet and bumper. If the gap isn't even on both sides, the panel may have been removed or the car may have been in an accident.",
        "Look for paint marks on the rubber seals or the glass, a sign of repainting after an accident.",
        "Look under the car: heavy rust, welding marks, or oil or water leaks.",
        "Glass: all the original windows usually carry the same marking. A different one may mean it was replaced after an accident.",
      ]],

      ["h2", "Tyres"],
      ["ul", [
        "The side of the tyre has a 4-digit code showing when it was made: the first two digits are the week, the last two the year. For example, 3522 means week 35 of 2022.",
        "Old tyres fail the technical inspection even if they look fine, which means you'll pay for them after buying.",
        "Uneven wear (more on the inside or outside) points to an alignment or suspension problem.",
      ]],

      ["h2", "Inside the car"],
      ["ul", [
        "Turn the air conditioning to its coldest setting. In the UAE this is the most important check: it must cool quickly and strongly, and a compressor repair is expensive.",
        "Compare the mileage with the wear on the steering wheel, pedals and seats. Low mileage with a worn steering wheel suggests the odometer may have been changed.",
        "When you start the car, the dashboard warning lights should come on and then go off. If the engine, airbag or brake light stays on, there's a problem.",
        "Try everything: windows, mirrors, screen, camera, sensors and electric seats.",
        "A damp smell or water marks under the carpets can be a sign the car has been flooded.",
      ]],

      ["h2", "Engine"],
      ["ul", [
        "Ask for the engine to be cold when you arrive. Some problems disappear once the engine is warm.",
        "Blue smoke means the engine is burning oil. Thick, constant white smoke can mean coolant is getting into the engine.",
        "Open the oil cap: a milky white substance there is a serious warning sign.",
        "Listen to the engine: ticking or a strange metallic noise needs checking.",
      ]],

      ["h2", "Test drive"],
      ["ul", [
        "The gearbox should shift smoothly without jolts or delay, at both low and high speeds.",
        "At a moderate speed, loosen your grip on the wheel: the car should go straight and not pull to one side.",
        "Brake hard in a safe place: the car shouldn't pull to one side and the steering wheel shouldn't shake.",
        "Listen for any knocking from the suspension when you go over a speed bump.",
      ]],

      ["h2", "Inspection at an approved centre"],
      ["p", "Even if everything looks fine, take the car for a pre-purchase inspection at an approved inspection centre or a garage you trust. A full inspection finds things you can't see: repainting and accidents, the condition of the gearbox and engine, and the suspension. It usually costs between AED 250 and AED 1,000 depending on the place and the type of inspection, which is little compared with a gearbox or engine repair."],
      ["tip", "If the seller refuses to let you inspect the car at a centre, take that as a clear sign. A seller whose car is sound isn't afraid of an inspection."],

      ["h2", "Papers and ownership transfer"],
      ["ul", [
        "Make sure the name on the registration is the person selling to you, or that they hold an official power of attorney.",
        "Make sure there's no bank mortgage on the car. If there's a loan, it must be paid off and the mortgage released before the transfer.",
        "The transfer requires the car to pass a technical inspection, and the inspection certificate is only valid for a limited time.",
        "Don't pay a deposit before seeing the car yourself. Ideally pay the full amount by bank transfer at the time of the ownership transfer.",
      ]],

      ["cta", { text: "Ready to look? Browse used cars for sale across the UAE.", href: "/used-cars", label: "Browse cars" }],
    ],
  },

  "gcc-vs-american-specs": {
    title: "GCC or imported? The difference between GCC and American specs, and how to check",
    description: "The difference between a GCC-spec car and an American import, why GCC cars cost more, and how to check a car's specs before you buy in the UAE: the dealer, the door sticker, the speedometer and the accident report.",
    body: [
      ["p", "«GCC or imported?» is the first question every buyer in the UAE asks, and for good reason: the price difference can be thousands of dirhams, and the difference in condition can be even bigger. This guide explains the difference and how to check for yourself before you pay."],

      ["h2", "What does GCC spec mean?"],
      ["p", "A GCC-spec car is one the manufacturer built for the Gulf markets and that was first sold through a dealer in the region. Manufacturers prepare these cars for the Gulf climate. The details vary from brand to brand, but they usually include:"],
      ["ul", [
        "Stronger cooling for the engine and gearbox, because temperatures here go above 45°C.",
        "A more powerful air conditioning system.",
        "Air filters that cope better with dust and sand.",
        "Better protection against rust and humidity.",
      ]],
      ["p", "Most importantly, a GCC car has a record with the dealer in the region, and its warranty and servicing are with the local dealer."],

      ["h2", "What does imported mean?"],
      ["p", "An imported car was made for another market (usually the US or Canada, sometimes Japan or Europe) and then shipped to the UAE. Many come from car auctions in the US, and some have been in an accident, flooded, or registered as «salvage», meaning the insurer there declared it a total loss before it was repaired and shipped."],
      ["p", "Not every imported car is bad. Some are clean and very well priced. The problem is that you don't know its history unless you look it up."],

      ["h2", "Why do GCC cars cost more?"],
      ["ul", [
        "The history is known: the dealer has the service record, and there are usually only one or two owners in the same country.",
        "They are built for the Gulf climate at the factory.",
        "They are easier to sell, and for a better price, when you sell later.",
        "Some insurers or dealers treat imported cars on different terms, so ask before you buy.",
      ]],

      ["h2", "How to check that a car is GCC spec"],
      ["ol", [
        "Ask the dealer: call the brand's dealer and give them the VIN. If the car was sold through them, they'll tell you and give you the service history. This is the strongest proof.",
        "The driver's door sticker: open the driver's door and look at the label on the frame. A car made for the US market usually has an English label saying it meets the U.S. Federal Motor Vehicle Safety Standards.",
        "The speedometer: an American car shows miles per hour (MPH) in large numbers, with kilometres small or missing. The speedometer is sometimes swapped, so don't rely on it alone.",
        "The owner's manual and the screen language: a GCC car usually comes with an Arabic manual and a screen system that supports Arabic.",
        "A vehicle history report: if you suspect it's an American car, get a report such as Carfax or AutoCheck using the VIN. It shows whether it was sold at auction, had an accident, or is registered as salvage.",
      ]],
      ["tip", "The VIN alone doesn't prove a car is GCC spec. Its first character shows the country of manufacture, not the market it was sold in. For example, many GCC Chevrolets and GMCs are made in the US, and their VIN starts with 1 just like American ones. Any claim that «a VIN starting with letter X means GCC» is wrong."],
      ["cta", { text: "Check a VIN for free: country of manufacture, model year and factory specs.", href: "/vin-check", label: "VIN check" }],

      ["h2", "The bottom line"],
      ["ul", [
        "GCC cars cost more because they are built for our climate and their history is known.",
        "An imported car can be a good deal, as long as you know its history from a report and an inspection.",
        "The strongest way to check: ask the dealer with the VIN, then have the car inspected at an approved centre.",
        "Don't rely on the seller's word alone. Ask for proof.",
      ]],
      ["cta", { text: "Looking for a GCC car? Use the specs filter on the cars page.", href: "/used-cars", label: "Browse cars" }],
    ],
  },
};
