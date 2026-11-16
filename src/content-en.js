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
        "Visit statistics: we record the page you visited and where you came from (such as Instagram, Google or a direct link), without your name or IP address, to count visits and views of each ad. We also count taps on each ad's WhatsApp and call buttons, without any data about you or the content of your messages.",
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
  "used-hybrid-car-uae": {
    title: "Buying a used hybrid car in the UAE: worth it or is petrol better? What to check",
    description: "Thinking of a used hybrid in the UAE? When a hybrid saves you money and when petrol makes more sense, how heat affects the battery, battery warranty, and what to check before you pay.",
    body: [
      ["p", "Hybrids are now a common sight on UAE roads: Camry Hybrid, Prius, RAV4, Lexus, and even a Land Cruiser hybrid. With more of them on the used market, buyers keep asking: is a used hybrid worth it, or is petrol simpler? And what about the battery in our heat? This guide gives practical answers and a checklist before you pay."],
      ["h2", "1. What is a hybrid?"],
      ["p", "A regular (non plug-in) hybrid has a petrol engine plus an electric motor and a battery. The battery charges itself from the engine and from braking: when you slow down, the system recovers part of the energy and stores it instead of losing it as heat. The electric motor then helps the engine, especially when pulling away and at low speeds."],
      ["p", "You never plug it in; you fill up with petrol like any car. Plug-in hybrids and full electric cars are a different calculation."],
      ["h2", "2. When does a hybrid save money, and when not?"],
      ["p", "A hybrid shows its advantage in traffic and city driving, with lots of stopping and starting. If most of your driving is long highway trips at steady speed, the fuel difference gets smaller."],
      ["ul", [
        "A hybrid suits you if you drive daily in city traffic, cover a lot of kilometres a year, or use the car for work or deliveries.",
        "Petrol may suit you better if you drive little, mostly on highways, or find a petrol version much cheaper. The price gap has to pay back through fuel savings.",
        "Do the maths yourself: compare both prices, your monthly kilometres and each car's official consumption. Don't rely on the seller's figures.",
      ]],
      ["h2", "3. Heat and the battery"],
      ["p", "High temperatures speed up battery ageing over the years; that is well known from battery research. It doesn't mean hybrids don't suit the UAE. Batteries have a cooling system, and many models have a battery air vent inside the cabin, often near the rear seat. If it is blocked by bags or dust, the battery runs hotter."],
      ["ul", [
        "Ask where the car was parked: covered parking is better than full sun all day.",
        "Find the battery air vent (the owner's manual shows where) and check it is clean and not blocked.",
        "Listen to the battery cooling fan: if it is unusually loud or runs all the time, have it checked.",
      ]],
      ["tip", "Heat affects the battery, but neglect affects it more. A regularly serviced hybrid kept under shade is often better than a lower-mileage one that was neglected."],
      ["h2", "4. Battery warranty: check it with the VIN"],
      ["p", "According to Toyota UAE's official warranty page, the hybrid battery is covered for 8 years or 160,000 km, whichever comes first, and the page says the warranty transfers to the next owner. The warranty depends on servicing to the factory schedule at the dealer's approved centres. Other brands have their own terms, so don't assume the same for every car."],
      ["ol", [
        "Get the VIN from the seller.",
        "Call the dealer and ask whether battery warranty remains and when it ends.",
        "Ask for the service history and any notes on the hybrid system.",
        "If the car is imported, the local dealer warranty usually doesn't cover it. Confirm before paying.",
      ]],
      ["cta", { text: "Check the VIN for free and confirm the model year and country of manufacture before calling the dealer.", href: "/vin-check", label: "VIN check" }],
      ["h2", "5. What to check on a used hybrid"],
      ["p", "Do the full normal used-car inspection, plus these hybrid points:"],
      ["ul", [
        "Start the car: the Ready light should come on with no hybrid system warning lights.",
        "Drive slowly: most hybrids move on electric power for a bit before the petrol engine starts. Note if the engine starts and stops oddly or far too often.",
        "Watch the battery gauge on the screen: if it swings up and down very quickly in normal driving, tell the inspector.",
        "Ask for a hybrid system check at the dealer or a centre with hybrid diagnostic equipment, not just a standard mechanical check.",
        "Ask if the battery was ever replaced, when and where, and ask for the invoice.",
        "Brakes on hybrids often wear more slowly thanks to energy recovery, but still check them.",
      ]],
      ["h2", "6. Accidents and flooding matter more on a hybrid"],
      ["p", "Hybrids have high-voltage cables and parts, usually orange. A heavy impact near the battery or water getting into the car can cause costly electrical problems. Check the accident report and ask the inspector to look at the battery area and cables. If you suspect the car was in rain or a flood, read the signs of a flooded car first."],
      ["cta", { text: "Read how to spot a car damaged by flooding and rain.", href: "/blog/flood-damaged-used-car-uae", label: "Flooded car signs" }],
      ["h2", "Summary"],
      ["ul", [
        "A used hybrid is a good choice if you drive a lot in the city.",
        "Heat affects the battery, so check where it was parked and that the air vent is clean.",
        "Confirm battery warranty and service history with the dealer using the VIN.",
        "Have the hybrid system checked with proper equipment.",
        "Compare the price with the petrol version and see if the difference really pays back.",
      ]],
      ["cta", { text: "Looking for a used hybrid? Browse Toyota cars for sale now and compare prices.", href: "/used-cars/toyota", label: "Toyota cars" }],
    ],
  },
  "used-car-websites-uae": {
    title: "Used car websites in the UAE: how to choose where to sell or buy",
    description: "Where to sell or buy a used car in the UAE? Listing sites, Instagram brokers and showrooms compared, and what to look for in any site before you post an ad or contact a seller.",
    body: [
      ["p", "The UAE used car market is big and there are plenty of options: listing websites, broker accounts on Instagram, showrooms and auctions. Each has its pros and cons. This guide explains the difference, and what to look for in any site before you post an ad or contact a seller."],

      ["h2", "1. Where used cars are bought and sold in the UAE"],
      ["ul", [
        "Listing websites and apps: you post your ad with photos and specs, and buyers contact you directly. Best if you want to reach the most buyers.",
        "Broker accounts on Instagram: they post your ad on their page, usually for a fee, and reach their followers. Fast, but the ad gets buried among posts after a few days.",
        "Showrooms: you sell the car to them or leave it on display. Quicker and easier, but the price is usually lower than a direct sale because the showroom needs its margin.",
        "Auctions: suit some cars, but the final price is out of your hands.",
      ]],

      ["h2", "2. What to look for in a listing website"],
      ["ul", [
        "Free listing, or a clear price from the start with no hidden fees.",
        "Direct contact between seller and buyer, by phone or WhatsApp, with no middleman pushing the price up.",
        "Clear search filters: make, model, year, mileage, emirate, specs (GCC or imported) and budget.",
        "Tools that help you decide, such as a price comparison with similar cars and a VIN check.",
        "A way to report suspicious ads, and clear warnings against scams.",
        "Works well in Arabic and fast on mobile, since most people browse on their phone.",
      ]],

      ["h2", "3. Tips for sellers"],
      ["ul", [
        "Photograph the car in daylight from every side, the interior, and the odometer.",
        "List the full specs: year, mileage, GCC or imported, any accidents or repaints. Being upfront saves you pointless calls.",
        "Price close to the market. Check what similar cars are listed for before you set yours.",
        "Have your papers ready: the mulkiya, the inspection and any dealer service record.",
      ]],

      ["h2", "4. Tips for buyers"],
      ["ul", [
        "Never transfer a deposit before you have seen and checked the car yourself.",
        "Check the VIN and match it with the mulkiya, and ask the dealer for the service record.",
        "Have the car inspected at an approved centre before you pay.",
        "Compare the price with similar cars of the same year and mileage.",
        "If the price is far below the market, ask why before you get excited.",
      ]],

      ["h2", "5. Why CarsUAE?"],
      ["p", "CarsUAE is an Arabic used car marketplace in the UAE: listing is free and buyers contact the seller directly by phone or WhatsApp. Every listing shows how its price compares with similar cars on the site, and you can check the VIN for free from the same page. We also show ads from approved brokers, credited to the account that posted them, so you know where every car comes from."],
      ["cta", { text: "Have a car to sell? List it free on CarsUAE and reach buyers directly.", href: "#sell", label: "Sell your car for free" }],
      ["cta", { text: "Looking for a car? Browse the used cars for sale now.", href: "/used-cars", label: "Browse cars" }],
    ],
  },
  "used-car-insurance-uae": {
    title: "Used car insurance in the UAE: comprehensive or third party? A buyer's guide",
    description: "Bought a used car in the UAE? The difference between comprehensive and third-party insurance, what each covers, agency repair, and what happens to insurance on transfer.",
    body: [
      ["p", "The first question after agreeing on a used car is usually: how do I insure it, and do I need comprehensive or is third party enough? The choice makes a big difference to what you pay, and to what happens if you have an accident. This guide explains the difference simply, what to ask the insurer, and how insurance works with an ownership transfer."],

      ["h2", "1. Why insurance is required"],
      ["p", "In the UAE you cannot register a car or renew its registration without valid insurance. In Dubai, for example, the RTA checks the insurance and technical inspection before renewing a registration, and when a used car changes hands the buyer buys their own insurance through the app before the transfer is completed."],
      ["p", "So the seller's insurance does not pass to you. You take out a policy in your name, and the seller cancels theirs and claims back whatever share is due."],

      ["h2", "2. Third-party insurance: what it covers and what it doesn't"],
      ["p", "Third-party liability is the legal minimum and the cheapest option. Its policy wording is unified across insurers under Central Bank of the UAE rules, so the basic cover is the same whichever company you choose."],
      ["ul", [
        "Covers: damage your car causes to other people, their cars and their property, and injuries to them.",
        "Does not cover: any damage to your own car if you caused the accident.",
        "Does not cover: natural disasters such as floods, under the unified policy.",
        "Injuries to the driver and passengers are not fully covered unless you add a personal accident endorsement for an extra premium.",
      ]],
      ["tip", "Third party suits an older, low-value car that you would repair out of your own pocket anyway. For an expensive car, think carefully before settling for it."],

      ["h2", "3. Comprehensive insurance: when is it worth it?"],
      ["p", "Comprehensive includes everything in third party and also covers your own car, whether you were at fault or someone hit you. According to the Central Bank of the UAE's guide, the loss and damage cover includes:"],
      ["ul", [
        "Accidents, collisions and overturning.",
        "Fire, explosion and lightning.",
        "Theft, or deliberate damage by another person.",
        "Damage while the car is transported, loaded or unloaded.",
        "Any extra cover you agree with the insurer.",
      ]],
      ["p", "Comprehensive is worth it if the car is valuable, if you bought it with bank finance (ask the bank which cover it requires), or if you couldn't afford a big repair yourself."],
      ["tip", "Floods and rain damage are not guaranteed in every comprehensive policy. Ask the insurer directly whether the policy covers rain, flood and natural-disaster damage, and make sure the answer is written in the policy."],
      ["cta", { text: "Worried the car you want was flooded before? Read how to spot it before you insure it and pay.", href: "/blog/flood-damaged-used-car-uae", label: "Spot a flood-damaged car" }],

      ["h2", "4. Agency repair or a garage?"],
      ["p", "This matters a lot for used cars. According to the Central Bank's guide, agency repair with new original parts is generally for cars one year old or less with comprehensive cover, usually for an extra premium. After that the insurer can repair at suitable approved garages and may use non-original parts of the same quality."],
      ["p", "So if you buy a five-year-old car, don't expect agency repair unless the insurer offers it and writes it into the policy. Ask which garages the insurer works with in your emirate."],

      ["h2", "5. What to ask the insurer before you pay"],
      ["ol", [
        "What is the car's insured value? Make sure it is close to its market price, because a total-loss payout depends on it.",
        "What is the excess (the amount you pay per claim)?",
        "Is there a replacement car during repairs, and for how many days?",
        "Are you covered in Oman? If you drive there, ask about Oman cover.",
        "Is roadside assistance included (towing, battery, flat tyre)?",
        "Is personal accident cover for the driver and passengers included, or extra?",
      ]],
      ["p", "Note: under the unified policy, if repairs after an accident cost more than half the car's value, or the chassis has to be cut and welded, the car is treated as a total loss. That is why the insured value matters."],

      ["h2", "6. The no-claims discount: don't lose it"],
      ["p", "If you insured a car before without claims, your previous insurer must give you an insurance experience certificate free of charge (on paper or electronically). It helps you get a no-claims discount from the new insurer, and the discount grows with each claim-free year."],
      ["p", "So if you sell your old car and buy another used one, ask for the certificate before cancelling the old policy and give it to the new insurer."],

      ["h2", "7. Insurance and ownership transfer, step by step"],
      ["ol", [
        "Agree the price with the seller and check the car and its VIN.",
        "Take out your new policy in your name. In Dubai you can buy it through the RTA app during the transfer.",
        "Complete the transfer at a service centre or in the app.",
        "The seller asks their insurer to cancel the policy and refund the share due. The refund shrinks the longer the policy has run, and there is none if there is a claim the seller caused.",
      ]],
      ["p", "Want the documents and steps for each emirate? We have a full ownership transfer guide."],
      ["cta", { text: "Read the guide to transferring a used car's ownership in Dubai and the UAE.", href: "/blog/car-ownership-transfer-uae", label: "Ownership transfer guide" }],

      ["h2", "Summary"],
      ["p", "An old, low-value car? Third party is usually enough. An expensive or financed car? Take comprehensive and read the policy carefully, especially on floods, repairs and the insured value. And above all, choose the right car in the first place."],
      ["cta", { text: "Browse used cars for sale across the UAE and contact sellers directly.", href: "/used-cars", label: "Browse cars" }],
    ],
  },
  "used-nissan-patrol-buying-guide": {
    title: "Used Nissan Patrol in the UAE: buying guide and what to check before you pay",
    description: "Buying a used Nissan Patrol in the UAE? The difference between the Y61, Y62 and Y63, and what to check in the gearbox, hydraulic suspension and engine before paying.",
    body: [
      ["p", "In the UAE the Patrol is more than a car: it is part of desert trips and weekends outdoors, which is why it is one of the most searched used cars. But it is heavy and powerful, and most have seen sand, heat and dune drives, so an inspection before buying matters. This guide covers the generations you will find on the market, what to check on each, and how to close the deal with peace of mind."],

      ["h2", "1. Which generation will you find?"],
      ["ul", [
        "Y61 (the older Patrol, including Safari and Super Safari): launched in the late 1990s. The best-known UAE versions use the 4.8-litre six-cylinder petrol engine (TB48). Desert fans like it for being simple and tough.",
        "Y62 (2010 on): revealed in Abu Dhabi in February 2010, and the most common modern used Patrol in the UAE. There are 4.0-litre V6 versions and 5.6-litre V8 versions with about 400 hp, with a 7-speed automatic.",
        "Y63 (the new generation): revealed in Abu Dhabi in September 2024, with a 3.8-litre V6 or a 3.5-litre twin-turbo V6, a 9-speed gearbox and more electronics. Used examples are still few and expensive.",
      ]],
      ["p", "The Y62 received styling updates over the years, the last big one in 2020 with a new grille and revised tail lights. Be careful: some older Patrols have been fitted with the newer look (a facelift conversion), so don't judge the year by the looks."],
      ["tip", "The real model year comes from the VIN and the registration card, not the grille and lights. A converted car should be priced for its original year."],
      ["cta", { text: "Check the VIN for free and confirm the make and year before the viewing.", href: "/vin-check", label: "Check a VIN" }],

      ["h2", "2. The gearbox: the most important thing to test"],
      ["p", "The Patrol's gearbox carries a heavy car and a big engine, and our heat is hard on the fluid. On the test drive:"],
      ["ul", [
        "Don't settle for a short drive with a cold car. Drive until the engine reaches normal temperature, because some faults only show when the gearbox is hot.",
        "Watch for hesitation, jerks or harsh shifts, especially at low speed and in traffic.",
        "Nissan treats the gearbox fluid as lifetime, but some owners noticed odd shifts when towing in hot weather, and some reviews suggest changing it periodically. Ask the seller when the fluid was last changed.",
        "Try four-wheel drive: Auto, 4H and 4L, and make sure the light changes and the car responds.",
      ]],

      ["h2", "3. Hydraulic suspension (HBMC)"],
      ["p", "Most top-spec Y62s have Hydraulic Body Motion Control, which reduces body roll in corners. It is not air suspension, but repairs can be costly compared with conventional suspension. What to do:"],
      ["ul", [
        "Look under the car for hydraulic fluid leaks at the shocks or lines.",
        "Park on level ground and check the car sits straight and doesn't lean to one side.",
        "On the drive, notice if it bounces a lot over bumps or leans too much in turns.",
      ]],

      ["h2", "4. Engine, cooling and air conditioning"],
      ["ul", [
        "Start the engine cold and listen: any persistent ticking or noise from the timing side needs a specialist's check.",
        "Look for oil leaks around the valve covers and under the engine, something UAE specialists often mention.",
        "Check the cooling system: coolant level, radiator and any signs of leaks. Heat and desert driving are hard on cooling.",
        "Test the air conditioning in every zone, front and rear, and make sure it stays cold at idle.",
        "Ask for the service history, especially on high-mileage cars.",
      ]],
      ["cta", { text: "Take the full step-by-step inspection checklist with you to the viewing.", href: "/blog/used-car-inspection-checklist", label: "Used car inspection checklist" }],

      ["h2", "5. Desert marks and modifications"],
      ["p", "The Patrol loves the desert, and the desert leaves marks. Get the car on a lift or look underneath at a garage:"],
      ["ul", [
        "Dents or scrapes under the chassis, and bent suspension arms.",
        "The engine oil sump, which is fairly exposed and can be hit by rocks.",
        "Brakes and tyres: the car is heavy and wears pads, discs and tyres faster, so factor them into the price.",
        "Modifications: lifts, turbos, exhausts or tuning. It is better to avoid heavily modified cars unless the work was done by an approved shop and you have the papers.",
      ]],

      ["h2", "6. Fuel and running costs"],
      ["p", "Be realistic: the 5.6-litre V8 is thirsty, real-world consumption is usually above the official figure, and the tank is large (140 litres). The V6 is easier on the wallet but less powerful. Think about how you'll use it: for mostly city driving the V6 may be enough; for desert trips and towing most people prefer the V8."],

      ["h2", "7. Before you agree on a price"],
      ["ol", [
        "Compare with Patrols of the same generation, year, mileage and engine (V6 or V8). The gap between versions is large.",
        "Ask about the specs: GCC or imported? Has the car been registered in accidents?",
        "Take the car to an approved inspection centre or a garage that knows the Patrol, and have the check cover the gearbox, suspension and underside.",
        "Use any fault the inspection finds, such as a leak, worn pads or old tyres, when negotiating the price.",
      ]],
      ["h2", "The bottom line"],
      ["p", "A used Patrol is an excellent choice if you buy it right: confirm the real year by VIN, test the gearbox hot, check the hydraulic suspension and leaks, and look underneath. Don't rush; there are plenty of Patrols on the market."],
      ["cta", { text: "Browse used Nissan cars on CarsUAE and contact the seller directly.", href: "/used-cars/nissan", label: "Browse used Nissan" }],
    ],
  },
  "used-car-scam-signs-uae": {
    title: "Used car scams in the UAE: signs of a fake ad and how to protect yourself",
    description: "Signs of a scam used-car ad in the UAE, the tricks fraudsters use on sellers such as forged cheques and fake transfer receipts, and where to report fraud.",
    body: [
      ["p", "Buying and selling cars online is easier than ever in the UAE: take photos, post the ad, and buyers call. Fraudsters exploit that same ease. Police in Dubai, Abu Dhabi and Sharjah have warned several times about tricks aimed at both sellers and buyers, and gangs have been caught buying expensive cars with forged cheques. This guide covers the signs of a scam ad, the tricks aimed at sellers, and what to do if it happens to you."],

      ["h2", "1. Signs of a scam ad when you're buying"],
      ["ul", [
        "The price is far below the market for no clear reason. Compare with cars of the same model, year and mileage, and if the gap is big, ask why.",
        "The seller asks for a deposit or transfer before you see the car, saying \"lots of buyers want it\" or \"I'll hold it for you\".",
        "The seller says he is travelling or abroad, and the car will be \"delivered\" after you transfer the money.",
        "He refuses a viewing or an inspection at an approved centre, or wants to meet somewhere odd and remote.",
        "The photos are taken from the internet or another ad, or are all close-ups that hide the plate and location.",
        "The name on the registration card differs from the person you're talking to, with no clear authorisation.",
      ]],
      ["p", "Watch the style more than the words. A fraudster is usually friendly and quick to reply, with a convincing story: travelling, needing money fast, or the car is with a relative. Whenever you ask a precise question or ask to see the car, he pushes you on time again. An honest seller doesn't mind you seeing and inspecting the car and taking your time, because he trusts his car."],
      ["tip", "Golden rule: don't transfer a single dirham before you have seen the car, test-driven it, and confirmed the registration is in the seller's name or that he has an official authorisation."],

      ["h2", "2. Check the car itself before paying"],
      ["ol", [
        "Ask for a copy of the registration card and compare its chassis number with the number on the car (usually at the windscreen and on the door pillar).",
        "Check the VIN and make sure the make, model and year match the ad.",
        "Take the car to an approved inspection centre or a garage you trust before you agree.",
        "Make the ownership transfer and the payment happen at the same time, in an official place such as a vehicle registration centre.",
      ]],
      ["cta", { text: "Before the viewing, check the VIN for free and see the car's details.", href: "/vin-check", label: "Check a VIN" }],

      ["h2", "3. When you're selling: the fake buyer's tricks"],
      ["p", "Fraud isn't only aimed at buyers. Many people have sold their cars and never received a dirham. The best-known tricks police have warned about:"],
      ["ul", [
        "Forged transfer receipt: the buyer inspects the car and sends a photo of a bank transfer receipt, saying the money will arrive in a few days. You hand over the car and the money never comes. Abu Dhabi Police warned about this in May 2024.",
        "Forged cheque at weekends and holidays: a fake cheque is deposited at an ATM on a holiday, your bank texts that the cheque is \"under collection\", and you think the money is on its way. Sharjah Police warned about this method.",
        "\"Company representative\": in 2025 Dubai Police caught a gang buying expensive cars from online ads; one member negotiated, another posed as a company representative and handed over a forged cheque, and the cars were shipped abroad within hours of the ownership transfer.",
        "Late-night rush: fraudsters like to close the deal at night or before a holiday, so you can't check with the bank.",
      ]],

      ["h2", "4. How to protect yourself when selling"],
      ["ul", [
        "Don't hand over the car or transfer ownership until the full amount has actually reached your account, not a receipt photo or an \"under collection\" text.",
        "If paid by cheque, call the bank and confirm the cheque is genuine and has cleared before handover. This is exactly what Dubai Police advise.",
        "Avoid closing a sale at weekends or on public holidays when banks are closed.",
        "Meet the buyer in a public place with cameras, such as an inspection or registration centre, not an empty spot.",
        "Don't share more copies of your personal documents or bank details than needed.",
      ]],
      ["cta", { text: "Learn the ownership transfer steps and required papers before you buy or sell.", href: "/blog/car-ownership-transfer-uae", label: "Ownership transfer guide" }],

      ["h2", "5. Suspicious messages and links"],
      ["p", "Sometimes the \"buyer\" sends a link that supposedly lets you receive the money or confirm shipping, and asks for your card details or the verification code from your bank. That's fraud. Receiving money never needs your card number or OTP. Don't open strange links and never share a code with anyone, whatever they say."],

      ["h2", "6. Been scammed? Where to report"],
      ["p", "The sooner you report, the better the chance police can stop the fraudster. Official channels:"],
      ["ul", [
        "The nearest police station, or call 999 in an emergency.",
        "The Ministry of Interior eCrimes platform, in the MOI UAE app.",
        "Dubai Police eCrime at ecrime.ae or the Dubai Police app.",
        "Abu Dhabi Police Aman service.",
        "The federal Public Prosecution's My Safe Society app.",
      ]],
      ["tip", "Keep everything: the fraudster's number, the chats, photos of the receipt or cheque, and the ad link. They help the police a lot."],

      ["h2", "Summary"],
      ["p", "Most used-car fraud relies on one thing: making you rush. See the car yourself, check the registration and VIN, and don't hand over or accept anything until the money is really in the account. If something doesn't feel right, walk away; there are plenty of other cars."],
      ["cta", { text: "Browse used cars on CarsUAE, contact the seller directly, and see the car before paying anything.", href: "/used-cars", label: "Browse cars" }],
    ],
  },
  "flood-damaged-used-car-uae": {
    title: "Flood-damaged car? How to spot a used car hit by floods and rain in the UAE",
    description: "A practical guide to spotting a used car that took on rainwater in the UAE: the smell, rust, electrics, seat belts, and the questions to ask before you buy.",
    body: [
      ["p", "On 16 April 2024 the UAE saw its heaviest rain in around 75 years, and many cars sat in water that reached the doors and sometimes the dashboard. Some were properly repaired and came back to the market; others were only cleaned on the outside and listed as if nothing had happened. Every rainy season the same question returns: how do I know the car I'm buying wasn't flooded? This guide gives you simple steps you can do yourself before you pay."],

      ["h2", "1. Why is a flooded car a big problem?"],
      ["p", "Water doesn't just stain the upholstery. It reaches the wiring, connectors and control units under the seats and dashboard, and corrosion starts quietly. The car may drive normally for the first weeks, then electrical faults come and go, warning lights appear, or a smell never leaves. These faults are expensive and hard to fix because their source isn't obvious."],
      ["p", "Second: if the car only had third-party insurance, the policy doesn't cover flood damage to the car itself, so the owner pays for repairs. That's why some people prefer to sell quickly rather than repair properly."],

      ["h2", "2. Use your nose first"],
      ["ul", [
        "Open a car that has been closed in the sun and smell it before the AC is switched on. A damp or musty smell is a clear sign.",
        "Be wary of a car that smells too fresh, or has several air fresheners. Sometimes the scent is covering something.",
        "Turn on the AC and smell the air from the vents. A bad smell can come from moisture in the system.",
      ]],

      ["h2", "3. Interior: look for water marks"],
      ["ul", [
        "Pull the seat belt all the way out and look at the part that normally stays rolled up. Water stains, damp or mud there are a strong sign.",
        "Feel the carpet under the feet and lift a corner if you can. Damp or fine silt underneath isn't normal.",
        "Open the boot, lift the floor and check the spare-wheel well: rust, water or a mud line.",
        "Check the seat rails and mounting bolts. Rust there on a fairly new car doesn't make sense.",
        "Notice if the carpet or upholstery is new or a different shade from the rest of the cabin for no clear reason.",
      ]],
      ["tip", "Rust in places water doesn't normally reach, like under the dashboard, inside the door hinges or on the steering column, matters more than anything the seller says."],

      ["h2", "4. Electrics: try every button"],
      ["p", "Electrics are the first thing to be damaged and the last to show it. Don't rush this step:"],
      ["ol", [
        "Turn the ignition on and watch the dashboard warning lights: they should all light up for a moment and then go out, especially airbag and ABS. A light that never comes on may have been disconnected to hide a problem.",
        "Test every window, mirror, central locking, radio and speakers, the screen, camera and sensors.",
        "Check the front and rear lights: condensation or a water line inside the lens is a warning.",
        "Run the AC at full, plus the wipers and horn.",
        "Anything that works one moment and stops the next is one of the worst signs.",
      ]],

      ["h2", "5. Underneath and on the test drive"],
      ["ul", [
        "Ask for the car to be put on a lift at a garage or inspection centre, and look for rust underneath, on the suspension and around the wheels.",
        "A line of dust or mud at the same level in the engine bay or on the doors shows how high the water reached.",
        "On the test drive, watch for engine misfires, odd gear changes, or a warning light coming on while driving.",
      ]],
      ["cta", { text: "Want a full step-by-step used car inspection checklist?", href: "/blog/used-car-inspection-checklist", label: "Inspection checklist" }],

      ["h2", "6. Questions to ask the seller"],
      ["ul", [
        "Where was the car during the rain? In a house, a basement, or on the street?",
        "Did water get in, or was it towed away on a rainy day?",
        "Is there an insurance claim on it? Was it repaired at the dealer?",
        "Do you have the service history or the invoices for the last repair?",
      ]],
      ["p", "An honest seller answers clearly and shows the paperwork. Dodging questions or rushing the sale («another buyer wants it today») is reason enough to slow down."],
      ["cta", { text: "Before the viewing, check the VIN and make sure the car's details match the ad.", href: "/vin-check", label: "VIN check" }],

      ["h2", "7. Too cheap? Don't celebrate yet"],
      ["p", "If you find a car of the same model, year and mileage priced far below the other ads, ask yourself why. Sometimes the seller really is in a hurry; sometimes the price hides a story like a flood or a major accident. Compare the price with similar cars on the market, and if the gap is big for no clear reason, make the inspection more thorough and ask more questions."],

      ["h2", "8. The final step: an approved inspection"],
      ["p", "Even if everything looks fine, take the car to an approved inspection centre or a garage you trust before you pay. Inspection centres in the UAE offer full pre-purchase checks covering the electrics, chassis and underbody, and the cost is small next to losing money on a flooded car. Ask the centre to note any signs of water or unusual rust in the report."],
      ["tip", "Never transfer any money before you have seen and checked the car yourself. If it doesn't feel right, walk away: the market is full of options."],

      ["h2", "Summary"],
      ["p", "A flooded car can be spotted if you take your time: smell the cabin, pull the seat belt, lift the carpet, test every button and look underneath. Ask the seller clear questions, and let an approved inspection have the last word before you pay."],
      ["cta", { text: "Browse the used cars for sale on CarsUAE now and contact sellers directly.", href: "/used-cars", label: "Browse cars" }],
    ],
  },
  "used-land-cruiser-buying-guide": {
    title: "Used Land Cruiser in the UAE: which generation to pick and what to check",
    description: "A guide to buying a used Toyota Land Cruiser in the UAE: the 200 vs the 300 series, the latest recall campaigns, and what to check in the engine, gearbox and underbody.",
    body: [
      ["p", "In the UAE the Land Cruiser is more than a car: it's the pick for families, desert trips and hunting season. Because demand is high, used prices stay high too, so a mistake is expensive. This guide explains the generations you'll find on the market, the latest recall campaigns, and how to check the car step by step before you pay a single dirham."],

      ["h2", "1. Which generation will you find?"],
      ["p", "Most used Land Cruisers for sale today come from two generations:"],
      ["ul", [
        "200 series: launched in late 2007 and built until 2021, with several updates to the looks and equipment over the years. In the GCC it came with V6 and V8 engines depending on the grade, with a conventional automatic gearbox. It's known for toughness and parts are easy to find, but most examples now have high mileage.",
        "300 series: launched in the UAE in June 2021. GCC grades came with two choices: a 4.0-litre V6 or a 3.5-litre twin-turbo V6, both with a 10-speed automatic. Known grades: EXR, GXR and VXR, later joined by GR Sport.",
        "In 2025 a hybrid version of the 300 series arrived in the UAE, pairing the 3.5 twin-turbo with a hybrid system. It's still new and rare on the used market.",
      ]],
      ["tip", "Don't rely on the seller's word about the grade and engine. Check the registration card and the VIN, and compare the grade with the equipment actually in the car."],

      ["h2", "2. Recall campaigns on the 300 series: you need to know"],
      ["p", "In October 2026 Al-Futtaim Motors, in coordination with the Ministry of Economy and Tourism, announced three recall campaigns covering about 29,774 Land Cruiser 300s in the UAE built between 2021 and 2024:"],
      ["ul", [
        "3.5 twin-turbo engine: possible manufacturing debris that can damage the crankshaft bearings in cars built in 2023 and 2024. Symptoms: knocking, rough running, hard starting, and sometimes the engine stalling while driving. The fix is a free inspection and an engine replacement where needed.",
        "Engine control software: a free update because engine output may not match the approved specification in some conditions.",
        "10-speed gearbox: the largest campaign, a free inspection and reprogramming of the transmission control unit because of possible gearbox damage or fluid leaks.",
      ]],
      ["p", "So if you want a used Land Cruiser 300, ask the seller whether the car has been to the dealer and had the recalls done, and ask for something in writing or a service record that proves it. The campaigns are free, but it's better to confirm they were done before you buy, not after."],
      ["cta", { text: "Have the VIN? Check it here and see the car's data and recalls where available.", href: "/vin-check", label: "Check the VIN" }],

      ["h2", "3. Check the engine and gearbox"],
      ["ul", [
        "Start the car cold and listen for any knocking or odd noise in the first minutes.",
        "Look at the engine oil: colour and level. Thick black oil or a very low level points to poor maintenance.",
        "On the 200 series in particular, ask about oil consumption and check the level yourself, as some cars use more oil than normal.",
        "Try every gear: shifts should be smooth, with no jolt or delay.",
        "Look under the car for engine or gearbox oil leaks.",
        "Ask for the service history, ideally from the dealer.",
      ]],
      ["p", "On the test drive, don't settle for a lap around the block. Take it on a fast road, try acceleration and braking, and watch for any steering shake or suspension noise over bumps. Run the AC at full blast too, because weak AC in our summer is no small thing."],

      ["h2", "4. Desert and sand: check underneath"],
      ["p", "Many Land Cruisers in the UAE spend time on dunes and in the desert, and that use shows under the car, not on top:"],
      ["ul", [
        "Check the chassis, sills and rear floor for knocks, bends or rust.",
        "Inspect the front drive-shaft boots: if they're cracked or leaking grease, costs are coming.",
        "With the steering at full lock, listen for clicking from the front.",
        "Check the air filter: lots of sand in it means the car has done plenty of desert driving.",
        "Make sure the tyre pressures are right; some owners deflate for sand and forget to reinflate.",
        "Make sure the spare wheel under the car lowers normally and is in good shape.",
      ]],
      ["tip", "If the mileage is low but the underside is battered and full of sand, stop and ask more questions. Mileage alone doesn't tell the whole story."],

      ["h2", "5. Paperwork and specs"],
      ["ul", [
        "Make sure the car is GCC spec if that's what you want. Imported Land Cruisers are on the market, and the spec difference affects price, cooling and parts.",
        "Check accident history, fines and any mortgage before you pay.",
        "Compare the mileage with the car's age and service record. If anything doesn't add up, ask.",
        "Take the car to an approved inspection centre before you complete the deal.",
      ]],
      ["cta", { text: "Want to understand GCC vs imported specs and how to confirm? Read our guide.", href: "/blog/gcc-vs-american-specs", label: "GCC or imported?" }],

      ["h2", "6. Bottom line: which one suits you?"],
      ["p", "If your budget is limited and you want a proven car with easy parts, a clean 200 series with a clear service record is a sensible choice; look for reasonable mileage and a healthy underside. If you want the newest and can afford it, the 300 series is stronger and more modern, but make sure the recalls are done. Either way, a pre-purchase inspection is what protects you."],
      ["cta", { text: "Browse the Land Cruisers and other Toyotas on CarsUAE now and contact the seller directly.", href: "/used-cars/toyota", label: "Used Toyota cars" }],
    ],
  },
  "car-ownership-transfer-uae": {
    title: "Used car ownership transfer in Dubai and the UAE: steps and documents",
    description: "How to transfer ownership of a used car in Dubai and the other emirates: documents, fines and mortgage, insurance and inspection, the online sale agreement, and mistakes to avoid.",
    body: [
      ["p", "Agreed on the car and paid a deposit? Good, but the deal isn't done until the car is officially in the buyer's name. Transferring ownership in the UAE is easier than it used to be and mostly happens on your phone, but there are steps and documents, and missing one stalls the whole thing. This guide walks through the Dubai process step by step as the Roads and Transport Authority (RTA) describes it, and what to do if the car is registered in another emirate."],

      ["h2", "1. First: clear the car's file"],
      ["p", "Most stalled transfers come down to one thing: the car's file isn't clean. The seller should sort these out before starting:"],
      ["ul", [
        "Pay every traffic fine on the car, in Dubai and in the other emirates too.",
        "If the car is mortgaged to a bank, settle the loan and release the mortgage. In Dubai the release is electronic once the bank sends it.",
        "If the registration has expired, pay the non-renewal fine.",
      ]],
      ["tip", "Buyers: don't pay in full before confirming the car has no mortgage and no fines. If the seller is paying off the loan with your money, pay the bank directly with clear paperwork."],

      ["h2", "2. Documents you need"],
      ["p", "The list is short, but every item matters:"],
      ["ul", [
        "A valid Emirates ID for the seller and the buyer.",
        "New electronic insurance in the buyer's name.",
        "A passed electronic technical inspection. New cars under three years old usually don't need one, but confirm at the time.",
        "If the customs card shows the car isn't GCC spec (imported), proof of compliance with GCC specifications is required.",
        "If someone acts for the seller or buyer: a power of attorney covering the sale and disposal of vehicles. A power of attorney issued outside the UAE must be attested by the Ministry of Foreign Affairs.",
        "A buyer without a traffic file: Emirates ID for citizens, or passport, residence visa and an Emirates ID copy for residents.",
      ]],
      ["cta", { text: "Before finishing the paperwork, make sure the VIN matches the car and see what it tells you.", href: "/vin-check", label: "Check the VIN" }],

      ["h2", "3. The steps in Dubai, from your phone"],
      ["p", "Dubai's RTA now uses an electronic sale and purchase agreement, and traditional paper agreements are no longer accepted at service centres. The seller starts the transaction:"],
      ["ol", [
        "The seller logs in to the RTA app, the RTA website or the Dubai Now app with UAE Pass and chooses the change vehicle ownership service.",
        "They select the car and pay any fines.",
        "They enter the buyer's Emirates ID number and mobile number.",
        "They choose what to do with the plate: hand it over or reserve it.",
        "The buyer receives a link by message, signs the agreement and pays the fees.",
        "The seller then signs and hands over the plate.",
        "The buyer completes insurance, inspection and registration at a service centre.",
      ]],
      ["p", "If you'd rather not use the app, you can do it at a Customer Happiness Centre or a vehicle registration and inspection centre: staff send you a link to upload the documents and sign electronically."],

      ["h2", "4. Important things to know"],
      ["ul", [
        "The online sale agreement is valid for 14 days only. If you don't finish within that time it is cancelled and you start again, and the RTA advises completing the whole transaction within 14 days to avoid fines.",
        "If anything in the agreement changes after both of you sign, it becomes void.",
        "Ownership moves to the buyer only after the seller hands over the plate.",
        "If the seller isn't available, the buyer can complete it with a sale agreement from an accredited Dubai showroom.",
        "The online agreement is for Dubai. A car registered in another emirate follows that emirate's system.",
      ]],

      ["h2", "5. Car registered in Abu Dhabi, Sharjah or another emirate?"],
      ["p", "Each emirate has its own licensing authority, and the idea is roughly the same: a clean file, insurance in the buyer's name, inspection where required, and both parties present or signing electronically."],
      ["ul", [
        "Abu Dhabi: the service is on the TAMM platform.",
        "Other emirates: through the Ministry of Interior app and website, or the emirate's licensing centres.",
        "Conditions and fees change from time to time, so check them on the authority's own site before you go rather than relying on figures from other websites.",
      ]],

      ["h2", "6. Mistakes that ruin the deal"],
      ["ul", [
        "Handing over the car or the key before the full amount arrives. Make payment happen at the transfer, and a bank transfer is safer than a lot of cash.",
        "Buying without an inspection. Have the car checked at an approved centre before you sign anything.",
        "Agreeing on a private paper without an official transfer. Until ownership moves, the car is legally the seller's, and any fine or accident comes back to them.",
        "Not checking the seller. Match the name on their Emirates ID with the name on the registration, and ask for the power of attorney if someone else is selling for them.",
      ]],

      ["h2", "7. Sellers: what to do after the sale"],
      ["p", "Deal done? A few small things protect you from headaches later:"],
      ["ul", [
        "Confirm in the app that the car is no longer registered in your name. Until then, any fine on it comes back to you.",
        "If you reserved the plate, check that it is now reserved in your name.",
        "Dubai's change of ownership service gives you an insurance refund certificate for the sold car. Call your insurer and ask about a refund of the remaining period or moving it to your new car.",
        "If you advertised the car on CarsUAE, press «Mark as sold» so the ad disappears and the calls stop.",
      ]],
      ["tip", "Keep photos of the agreement and the payment receipt, and put the whole deal in writing on WhatsApp: the price, the deposit and who pays the fees. That avoids disputes later."],
      ["cta", { text: "Looking for a used car? See the latest ads across the UAE and contact sellers directly.", href: "/used-cars", label: "Browse cars" }],
    ],
  },
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
