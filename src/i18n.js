// English mode. The app is written in Arabic; on /en/... addresses this layer turns the
// page left-to-right and translates the visible interface text in place:
// exact phrases first, then a few patterns with numbers, then known words
// inside short strings (make and model names, cities ...). Long free text such
// as a seller's own description is left as written.
import { MAKE_SLUGS, isEnPath, langPath } from "./seo-data.js";

const UPPER = new Set(["bmw", "gmc", "mg", "byd", "gac", "jac", "ds", "baic", "faw", "gwm", "dfsk", "saic", "baw", "mini"]);
const makeEnglish = (slug) =>
  slug.split("-").map((w) => (UPPER.has(w) ? w.toUpperCase() : w === "and" ? "&" : w.charAt(0).toUpperCase() + w.slice(1))).join(" ")
    .replace("Mercedes Benz", "Mercedes-Benz").replace("Rolls Royce", "Rolls-Royce").replace("Mercedes Maybach", "Mercedes-Maybach")
    .replace("BMW Alpina", "BMW Alpina").replace("Lynk & Co", "Lynk & Co").replace("Li Auto", "Li Auto").replace("M Hero", "M-Hero")
    .replace("Great Wall", "Great Wall").replace("Ssangyong", "SsangYong").replace("Mclaren", "McLaren").replace("MINI", "MINI");

// Interface phrases (Arabic -> English).
const UI = {
  // cities
  "دبي": "Dubai", "أبوظبي": "Abu Dhabi", "الشارقة": "Sharjah", "عجمان": "Ajman", "رأس الخيمة": "Ras Al Khaimah",
  "الفجيرة": "Fujairah", "أم القيوين": "Umm Al Quwain", "العين": "Al Ain", "الإمارات": "UAE",
  // car facts
  "بنزين": "Petrol", "ديزل": "Diesel", "هجين": "Hybrid", "كهربائي": "Electric", "أوتوماتيك": "Automatic", "مانيوال": "Manual",
  "خليجي": "GCC", "أمريكي": "American", "أوروبي": "European", "ياباني": "Japanese", "كندي": "Canadian", "صيني": "Chinese",
  "كوري": "Korean", "أخرى": "Other", "يسار": "Left", "يمين": "Right", "جديدة": "New", "مستعملة": "Used", "جديد": "New",
  "سيدان": "Sedan", "دفع رباعي (SUV)": "SUV", "بيك أب": "Pickup", "هاتشباك": "Hatchback", "كوبيه": "Coupe", "فان": "Van", "رياضية": "Sports",
  "تحت 25 ألف": "Under 25k", "تحت 50 ألف": "Under 50k", "تحت 100 ألف": "Under 100k", "تحت 200 ألف": "Under 200k",
  "الآن": "Just now", "د.إ": "AED", "د.إ ·": "AED ·", "درهم": "AED", "كم": "km", "السعر عند التواصل": "Price on request",
  "الكل": "All", "⭐ مميز": "⭐ Featured", "مميز": "Featured", "إلغاء التمييز": "Remove featured", "تم إلغاء تمييز الإعلان": "Listing no longer featured", "للبيع": "For sale", "البائع": "Seller", "مشاهدة": "views", "مُباعة": "Sold", "سيارة": "cars", "سيارة جديدة": "New car",
  "إعلان": "listing",
  // header & menu
  "الصفحة الرئيسية": "Home", "السيارات": "Cars", "القائمة": "Menu", "تصفح السيارات": "Browse cars", "بيع سيارتك": "Sell your car",
  "فحص رقم الشاصي": "VIN check", "المقالات والنصائح": "Articles & tips", "الأسئلة الشائعة": "FAQ", "نصائح الأمان": "Safety tips",
  "للمعارض والوسطاء": "For dealers & brokers", "تواصل معنا": "Contact us", "إعلاناتي": "My listings", "المفضلة": "Favourites",
  "حسابي": "My account", "لوحة الإدارة": "Admin panel", "تسجيل الخروج": "Sign out", "تسجيل الدخول": "Sign in",
  "من نحن": "About us", "الشروط والأحكام": "Terms & conditions", "سياسة الخصوصية": "Privacy policy", "المقالات": "Articles",
  // home
  "ابحث عن سيارتك": "Find your car", "سيارات مستعملة للبيع في كل الإمارات، من البائع مباشرة.": "Used cars for sale across the UAE, straight from the seller.",
  "مثال: تويوتا كامري": "e.g. Toyota Camry", "بحث": "Search", "عندك سيارة للبيع؟": "Have a car to sell?",
  "انشر إعلانك مجانًا خلال دقيقة.": "Post your ad for free in a minute.", "أحدث السيارات": "Latest cars", "عرض الكل": "View all",
  "جارِ التحميل": "Loading", "جارِ التحميل...": "Loading...", "لا توجد سيارات معروضة بعد": "No cars listed yet", "كن أول من ينشر سيارته.": "Be the first to list your car.",
  "سيارات مستعملة للبيع في الإمارات": "Used cars for sale in the UAE", "سوق السيارات المستعملة في الإمارات": "The UAE used car market",
  // my listings
  "آخر تحديث": "Last updated", "لم تنشر أي إعلان بعد.": "You have not posted any listing yet.", "لم تضف أي إعلان إلى المفضلة بعد.": "You have no favourites yet.",
  "أضف سيارتك": "Add your car", "إرجاع للبيع": "Back on sale", "تم البيع": "Mark as sold", "تجديد": "Renew", "تعديل": "Edit", "حذف": "Delete",
  "منتهي · جدّده عشان يرجع يظهر": "Expired · renew it to show it again", "ظاهر للمشترين": "Visible to buyers", "ظاهر · ينتهي بعد": "Visible · ends in",
  // browse & filters
  "ابحث عن ماركة أو موديل": "Search a make or model", "الفلاتر": "Filters", "مسح الكل": "Clear all", "الترتيب": "Sort",
  "الأحدث": "Newest", "الأقل سعرًا": "Lowest price", "الأعلى سعرًا": "Highest price", "الأحدث موديلًا": "Newest model year", "الأقل ممشى": "Lowest mileage",
  "الماركة": "Make", "كل الماركات": "All makes", "الموديل": "Model", "كل الموديلات": "All models", "الإمارة": "Emirate", "كل الإمارات": "All emirates",
  "الميزانية": "Budget", "أي سعر": "Any price", "نوع السيارة": "Body type", "سنة الصنع": "Year", "من سنة": "From year", "إلى سنة": "To year",
  "الممشى": "Mileage", "أي ممشى": "Any mileage", "المواصفات": "Specs", "قابل للتفاوض فقط": "Negotiable only", "قابل للتفاوض": "Negotiable",
  "لا توجد سيارات مطابقة": "No matching cars", "جرّب تغيير البحث أو الفلاتر.": "Try changing the search or filters.", "مسح الفلاتر": "Clear filters",
  "وسيط معتمد": "Verified broker", "مشاركة الصفحة": "Share page", "كل سيارات": "All cars by", "كل إعلاناته": "All their listings",
  // sell form
  "تحتاج حساب لإضافة سيارتك ونشرها للجميع.": "You need an account to add your car and publish it.", "تسجيل الدخول / إنشاء حساب": "Sign in / Create account",
  "أضف سيارتك للبيع": "Add your car for sale", "إعلانك سيظهر مباشرة لجميع الزوار في الإمارات. لا رسوم على النشر.": "Your ad shows straight away to every visitor in the UAE. Posting is free.",
  "جاري فحص الصور…": "Checking photos…", "اضغط لإضافة صور السيارة (حتى": "Tap to add photos of the car (up to", "الرئيسية": "Main",
  "الصورة الأولى هي الرئيسية التي تظهر في نتائج البحث.": "The first photo is the main one shown in search results.",
  "ابحث عن الماركة…": "Search make…", "موديل آخر": "Other model", "ابحث عن الموديل…": "Search model…", "اكتب اسم الموديل": "Type the model name",
  "اسم الماركة": "Make name", "اكتب اسم الماركة": "Type the make name", "اسم الموديل": "Model name", "الحالة": "Condition", "السعر (د.إ)": "Price (AED)",
  "جهة المقود": "Steering side", "الممشى (كم)": "Mileage (km)", "نوع الوقود": "Fuel", "ناقل الحركة": "Transmission", "رقم الجوال": "Mobile number",
  "السعر قابل للتفاوض": "Price is negotiable", "تظهر شارة": "Shows a", "على إعلانك.": "badge on your ad.",
  "إذا خفّضت السعر، يظهر للمشترين السعر القديم مشطوبًا مع نسبة الخصم.": "If you lower the price, buyers see the old price crossed out with the discount.",
  "اسم البائع (اختياري)": "Seller name (optional)", "اسمك": "Your name", "وصف السيارة": "Description",
  "اذكر تفاصيل إضافية: الفحص، الصيانة، الحوادث...": "Add details: inspection, service history, accidents...", "نشر الإعلان": "Publish ad",
  // car page
  "تكبير الصورة": "Enlarge photo", "تم بيع هذه السيارة": "This car has been sold", "انتهت مدة هذا الإعلان": "This listing has expired",
  "خصم": "off", "مواصفات": "specs", "دفعة أولى 20%، 5 سنوات، فائدة ثابتة 3% سنويًا. للاسترشاد فقط.": "20% down payment, 5 years, 3% flat rate a year. For guidance only.",
  "قسط تقريبي من": "Approx. monthly payment from", "شهريًا": "a month", "الوقود": "Fuel", "الوصف": "Description", "الإعلان من حساب": "Listing from",
  "تم تأكيد رقم البائع": "Seller's number verified", "رقم موثّق": "Verified number", "اطلب رقم الشاصي من البائع وافحصه مجانًا": "Ask the seller for the VIN and check it for free",
  "افحص الشاصي": "Check VIN", "اتصال": "Call", "عرض الرقم": "Show number", "حذف الإعلان": "Delete listing", "إبلاغ عن الإعلان": "Report listing",
  "مشاركة الإعلان": "Share listing", "إزالة من المفضلة": "Remove from favourites", "إضافة إلى المفضلة": "Add to favourites",
  "إغلاق": "Close", "السابقة": "Previous", "التالية": "Next", "اضغط مرتين أو باصبعين للتكبير": "Double-tap or pinch to zoom",
  "واتساب": "WhatsApp", "سنة الموديل": "Model year",
  // sign in
  "أكّد بريدك الإلكتروني": "Confirm your email", "إنشاء حساب": "Create account", "أرسلنا رابط التأكيد إلى": "We sent a confirmation link to",
  "افتح الرسالة واضغط الرابط، ثم سجّل الدخول. إذا لم تجدها خلال دقيقتين، تحقق من مجلد الرسائل غير المرغوب فيها (Spam).": "Open the email and tap the link, then sign in. If it is not there within two minutes, check your Spam folder.",
  "ثانية": "s", "إعادة إرسال رابط التأكيد": "Resend confirmation link", "أكّدت بريدي، سجّل الدخول": "I confirmed my email, sign in",
  "البريد الإلكتروني": "Email", "كلمة المرور": "Password", "أحرف على الأقل": "characters minimum", "إنشاء الحساب": "Create account", "دخول": "Sign in",
  "أو": "or", "الدخول باستخدام Google": "Continue with Google", "الدخول باستخدام Apple": "Continue with Apple",
  "بالتسجيل أو الدخول، أنت توافق على": "By signing up or signing in you agree to the", "و": "and", "عندك حساب؟": "Have an account?",
  "ما عندك حساب؟": "No account?", "سجّل الدخول": "Sign in", "أنشئ حساب جديد": "Create a new account",
  // footer
  "عمليات بحث شائعة": "Popular searches", "سيارات حسب الإمارة": "Cars by emirate", "أشهر السيارات": "Popular cars", "حسب الميزانية": "By budget",
  // VIN page
  "فحص رقم الشاصي مجانًا | CarsUAE": "Free VIN check | CarsUAE", "مقالات ونصائح": "Articles & tips",
  "رقم الشاصي يبيّن مواصفات المصنع، لكنه وحده لا يثبت إذا كانت السيارة خليجية أو وارد.": "The VIN shows the factory specs, but on its own it does not prove whether a car is GCC or imported.",
  "للتأكد: اطلب من البائع سجل صيانة الوكالة، أو اسأل وكيل الماركة برقم الشاصي، أو افحصها في مركز فحص.": "To be sure: ask the seller for the dealer service record, ask the brand's dealer with the VIN, or inspect it at a test centre.",
  "مجانًا: بلد الصنع، الشركة المصنعة، سنة الموديل، ومواصفات المصنع.": "Free: country of manufacture, manufacturer, model year and factory specs.",
  "مثال: JTMHV05J804012345": "e.g. JTMHV05J804012345", "افحص": "Check",
  "تلقاه في ملكية السيارة، أو أسفل الزجاج الأمامي من جهة السائق، أو على باب السائق من الداخل. يتكون من 17 حرفًا ورقمًا.": "You find it on the registration card, at the bottom of the windscreen on the driver's side, or inside the driver's door. It has 17 letters and digits.",
  "بلد الصنع": "Country of manufacture", "المصنع": "Plant", "الشركة المصنعة": "Manufacturer", "نوع الهيكل": "Body type", "المحرك": "Engine",
  "نظام الدفع": "Drive", "الأبواب": "Doors", "المقاعد": "Seats", "خليجي ولا وارد؟": "GCC or imported?", "نداءات الاستدعاء من الشركة": "Manufacturer recalls",
  "لا توجد نداءات استدعاء مسجّلة لهذا الموديل.": "No recalls recorded for this model.", "يوجد": "There are",
  "نداء استدعاء لهذا الموديل والسنة. اسأل البائع أو الوكالة هل تم إصلاحها.": "recalls for this model and year. Ask the seller or the dealer whether they were fixed.",
  "هذا الفحص يقرأ مواصفات المصنع فقط، ولا يكشف الحوادث أو الممشى الحقيقي. قبل الشراء افحص السيارة في مركز فحص معتمد.": "This check reads factory specs only and does not reveal accidents or real mileage. Before buying, have the car inspected at an approved test centre.",
  "تصفح السيارات المعروضة للبيع": "Browse cars for sale", "تفاصيل المحرك والفئة غير متوفرة لهذا الرقم في قاعدة البيانات المجانية. المعلومات أعلاه مقروءة من رقم الشاصي نفسه.": "Engine and trim details are not available for this VIN in the free database. The information above is read from the VIN itself.",
  "تعذر فحص الرقم.": "Could not check the number.", "تعذر الاتصال الآن. حاول بعد قليل.": "Could not connect right now. Try again shortly.",
  "في رقم الشاصي رمز غير صحيح. تأكد من الرقم.": "The VIN has an invalid character. Check the number.", "أمريكا الشمالية": "North America",
  "هذا لا يعني أنها وارد، فكثير من سيارات الخليج (شيفروليه، جي إم سي، فورد، جيب...) تُصنع هناك.": "This does not mean it is imported: many GCC cars (Chevrolet, GMC, Ford, Jeep...) are made there.",
  // blog
  "المقالة غير موجودة": "Article not found", "كل المقالات": "All articles", "نصائح عملية لشراء وبيع السيارات المستعملة في الإمارات.": "Practical tips for buying and selling used cars in the UAE.",
  "دقائق قراءة": "min read", "راسلنا": "Message us",
  "من": "From", "إلى": "To", "أقل من": "Under", "خليجية": "GCC", "وكالة": "Dealer", "مواصفات خاصة": "Special specs", "وارد قطر": "Qatar import",
  // messages (toasts)
  "البريد أو كلمة المرور غير صحيحة": "Wrong email or password", "هذا البريد مسجّل مسبقًا. جرّب تسجيل الدخول.": "This email is already registered. Try signing in.",
  "كلمة المرور يجب أن تكون 6 أحرف على الأقل": "Password must be at least 6 characters", "محاولات كثيرة. انتظر دقيقة ثم حاول مرة أخرى.": "Too many attempts. Wait a minute and try again.",
  "تعذر إرسال رسالة التأكيد الآن. حاول بعد قليل.": "Could not send the confirmation email now. Try again shortly.", "اكتب بريدًا إلكترونيًا صحيحًا": "Enter a valid email",
  "حدث خطأ، حاول مرة أخرى": "Something went wrong, try again", "الإعلان غير موجود، ربما بيعت السيارة": "Listing not found; the car may have been sold",
  "سجّل الدخول أولًا لإضافة سيارتك": "Sign in first to add your car", "تم إنشاء الحساب وتسجيل دخولك": "Account created and signed in",
  "تم تسجيل الدخول بنجاح": "Signed in", "لم يتم تأكيد بريدك بعد. أرسلنا لك خيار إعادة إرسال رابط التأكيد.": "Your email is not confirmed yet. You can resend the confirmation link.",
  "أعدنا إرسال رابط التأكيد إلى بريدك": "We resent the confirmation link to your email", "تم تسجيل الخروج": "Signed out",
  "تعذر تسجيل الدخول عبر Google": "Could not sign in with Google", "تعذر تسجيل الدخول عبر Apple": "Could not sign in with Apple",
  "سجّل الدخول أولًا": "Sign in first", "سجّل الدخول أولًا لنشر إعلان": "Sign in first to post an ad",
  "يرجى تعبئة الماركة والموديل والسعر ورقم الجوال": "Please fill in make, model, price and mobile number",
  "يجب أن يكون السعر بين 1,000 و5,000,000 د.إ": "Price must be between AED 1,000 and 5,000,000", "تعذر رفع الصور": "Could not upload the photos",
  "تم تحديث الإعلان": "Listing updated", "تم نشر إعلانك بنجاح": "Your ad is live", "تعذر تحديث الإعلان": "Could not update the listing", "تعذر نشر الإعلان": "Could not publish the ad",
  "تم نسخ رابط الإعلان": "Link copied", "تعذر نسخ الرابط": "Could not copy the link", "سجّل الدخول لحفظ المفضلة": "Sign in to save favourites",
  "تعذر تحديث المفضلة": "Could not update favourites", "سجّل الدخول للإبلاغ": "Sign in to report", "سبق أن أبلغت عن هذا الإعلان": "You already reported this listing",
  "تم استلام بلاغك، شكرًا لك": "Report received, thank you", "تعذر إرسال البلاغ": "Could not send the report", "تم تعليم السيارة كمُباعة": "Marked as sold",
  "رجع الإعلان للبيع": "Listing is back on sale", "تم حذف الإعلان": "Listing deleted", "تعذر حذف الإعلان": "Could not delete the listing",
  "متأكد تبي تحذف هذا الإعلان نهائيًا؟": "Delete this listing for good?", "تعذر تحميل الصورة": "Could not load the photo",
  "لم نتعرف على سيارة في الصورة. يرجى رفع صورة واضحة للسيارة.": "We could not find a car in the photo. Please upload a clear photo of the car.",
  "أدخل رقم جوال إماراتي صحيح (مثال: 0501234567)": "Enter a valid UAE mobile number (e.g. 0501234567)",
  "يرجى تأكيد رقم الجوال عبر رمز التحقق أولًا": "Please confirm your mobile number with the verification code first",
  "تم تجاهل البلاغات ورجع الإعلان": "Reports dismissed and the listing is back",
  "حُذف الإعلان، لكن لم تُحذف أي صورة (تحقق من الصلاحيات)": "Listing deleted, but no photos were deleted (check permissions)",
  "تمت إضافة الوسيط": "Dealer added",
  "ما سبب الإبلاغ؟ (مثال: رقم تواصل خاطئ)": "Why are you reporting this listing? (e.g. wrong contact number)",
};

// Model names that appear in listings (Arabic -> English).
const MODELS = {
  "لاند كروزر": "Land Cruiser", "برادو": "Prado", "كامري": "Camry", "كورولا": "Corolla", "يارس": "Yaris", "راف فور": "RAV4", "هايلكس": "Hilux",
  "أفالون": "Avalon", "سيكويا": "Sequoia", "فورتشنر": "Fortuner", "هايس": "Hiace", "إف جي كروزر": "FJ Cruiser", "سوبرا": "Supra",
  "باترول": "Patrol", "باترول سفاري": "Patrol Safari", "التيما": "Altima", "صني": "Sunny", "إكس تريل": "X-Trail", "كيكس": "Kicks",
  "مكسيما": "Maxima", "أرمادا": "Armada", "باثفايندر": "Pathfinder", "إكستيرا": "Xterra", "روج": "Rogue",
  "الفئة 1": "1 Series", "الفئة 2": "2 Series", "الفئة 3": "3 Series", "الفئة 4": "4 Series", "الفئة 5": "5 Series", "الفئة 7": "7 Series",
  "الفئة A": "A-Class", "الفئة C": "C-Class", "الفئة E": "E-Class", "الفئة G": "G-Class", "الفئة S": "S-Class",
  "رينج روفر": "Range Rover", "رينج روفر سبورت": "Range Rover Sport", "ديفندر": "Defender", "ديسكفري": "Discovery", "ديسكفري سبورت": "Discovery Sport",
  "إيفوك": "Evoque", "فيلار": "Velar", "يوكن": "Yukon", "سييرا": "Sierra", "أكاديا": "Acadia", "تيرين": "Terrain",
  "تاهو": "Tahoe", "سوبربان": "Suburban", "سيلفرادو": "Silverado", "كامارو": "Camaro", "ماليبو": "Malibu", "تراكس": "Trax", "إمبالا": "Impala",
  "كابريس": "Caprice", "كابتيفا": "Captiva", "كورفيت": "Corvette", "إسكاليد": "Escalade", "إكسبلورر": "Explorer", "موستنج": "Mustang", "إيدج": "Edge",
  "إكسبيديشن": "Expedition", "إيكوسبورت": "EcoSport", "رينجر": "Ranger", "برونكو": "Bronco", "تشارجر": "Charger", "تشالنجر": "Challenger", "دورانجو": "Durango",
  "لانسر": "Lancer", "باجيرو": "Pajero", "أوتلاندر": "Outlander", "إكليبس كروس": "Eclipse Cross", "رانجلر": "Wrangler", "جراند شيروكي": "Grand Cherokee",
  "كومباس": "Compass", "شيروكي": "Cherokee", "غلاديتور": "Gladiator", "سيفيك": "Civic", "أكورد": "Accord", "سي آر في": "CR-V", "بايلوت": "Pilot", "أوديسي": "Odyssey",
  "النترا": "Elantra", "سوناتا": "Sonata", "توسان": "Tucson", "سنتافي": "Santa Fe", "أكسنت": "Accent", "باليسايد": "Palisade", "فينيو": "Venue", "كريتا": "Creta",
  "سيراتو": "Cerato", "سبورتاج": "Sportage", "سورينتو": "Sorento", "بيكانتو": "Picanto", "تيلورايد": "Telluride", "كارنيفال": "Carnival", "سيلتوس": "Seltos",
  "غوست": "Ghost", "فانتوم": "Phantom", "كولينان": "Cullinan", "رايث": "Wraith", "داون": "Dawn", "كونتيننتال": "Continental", "بنتايجا": "Bentayga",
  "فلاينج سبير": "Flying Spur", "مولسان": "Mulsanne", "كايين": "Cayenne", "ماكان": "Macan", "باناميرا": "Panamera", "تايكان": "Taycan",
  "هوراكان": "Huracán", "أوروس": "Urus", "أفينتادور": "Aventador", "روما": "Roma", "بورتوفينو": "Portofino", "ليفانتي": "Levante", "جيبلي": "Ghibli",
  "سويفت": "Swift", "جيمني": "Jimny", "فيتارا": "Vitara", "جراند فيتارا": "Grand Vitara", "بالينو": "Baleno", "سياز": "Ciaz", "دزاير": "Dzire",
  "جولف": "Golf", "باسات": "Passat", "تيجوان": "Tiguan", "جيتا": "Jetta", "بولو": "Polo", "مونجارو": "Monjaro", "نوتيلوس": "Nautilus", "أفياتور": "Aviator",
  "كوبر": "Cooper", "كنتري مان": "Countryman", "كانتري مان": "Countryman", "ليوبارد 5": "Leopard 5", "ليوبارد 7": "Leopard 7", "ليوبارد 8": "Leopard 8",
  "أداماس": "Adamas", "موديل Y": "Model Y", "موديل 3": "Model 3", "موديل X": "Model X", "أخرى": "Other",
  "الفئة V": "V-Class", "الفئة X": "X-Class", "CS35 بلس": "CS35 Plus", "بارتنر": "Partner", "بريفيس": "Preface", "بوكستر": "Boxster",
  "تاكوما": "Tacoma", "تندرا": "Tundra", "تورس": "Taurus", "جوك": "Juke", "جيب ويليز": "Jeep Willys", "جينيسيس 3.8": "Genesis 3.8",
  "ديستروير 05": "Destroyer 05", "ريو": "Rio", "سونج": "Song", "سيل 05": "Seal 05", "سيل 6": "Seal 6", "طوارق": "Touareg",
  "كادينزا": "Cadenza", "كين بلس": "Qin Plus",
  "إرتيقا": "Ertiga", "فورستر": "Forester", "ليجاسي": "Legacy", "أوتباك": "Outback", "إمبريزا": "Impreza", "تيريوس": "Terios",
  "بسيفيكا": "Pacifica", "نافيجيتور": "Navigator", "كورسير": "Corsair", "إنكليف": "Enclave", "إنكور": "Encore", "أطلس": "Atlas",
  "أسترا": "Astra", "إنسينيا": "Insignia", "كورسا": "Corsa", "غرانتلاند": "Grandland", "كلوبمان": "Clubman", "فورتو": "Fortwo",
  "فانتاج": "Vantage", "كواتروبورتي": "Quattroporte", "جوليا": "Giulia", "ستيلفيو": "Stelvio", "توناليه": "Tonale", "تيبو": "Tipo",
  "دوبلو": "Doblo", "دستر": "Duster", "كوليوس": "Koleos", "ميغان": "Megane", "كادجار": "Kadjar", "C5 إكروس": "C5 Aircross",
  "أوكتافيا": "Octavia", "كودياك": "Kodiaq", "سوبيرب": "Superb", "كاروك": "Karoq", "ليون": "Leon", "أتيكا": "Ateca", "إبيزا": "Ibiza",
  "إمجراند": "Emgrand", "كولراي": "Coolray", "عذراء": "Azkarra", "أليسون": "Alsvin", "إمكوو": "Emkoo", "هان": "Han", "تانج": "Tang",
  "أتو 3": "Atto 3", "سونج بلس": "Song Plus", "جوليون": "Jolion", "داراغون": "Dargo", "تيجو": "Tiggo", "أريزو": "Arrizo",
  "جود كات": "Good Cat", "فنكس": "Funky Cat", "ساجا": "Saga", "بوير": "Poer", "كانون": "Cannon", "ركستون": "Rexton", "تيفولي": "Tivoli",
  "توانو": "Tunland", "فيو": "View", "لانوس": "Lanos", "نوبيرا": "Nubira", "إليس": "Elise", "إيميرا": "Emira", "إيفيجا": "Evija",
  "داشينغ": "Dashing", "تريفل": "Traveller", "نامي": "Nammi", "إير": "Air", "غرافيتي": "Gravity", "سكوربيو": "Scorpio", "ثار": "Thar",
  "نيكسون": "Nexon", "هارير": "Harrier", "سافاري": "Safari", "شيرون": "Chiron", "فيرون": "Veyron", "جيسكو": "Jesko", "ريجيرا": "Regera",
  "ميغا": "MEGA", "فري": "Free", "دريم": "Dream", "باشن": "Passion", "غرينادير": "Grenadier", "وينغل": "Wingle", "ألفا S": "Alpha S",
  "ألفا T": "Alpha T", "غلوري 500": "Glory 500", "غلوري 580": "Glory 580", "يويا": "Yoyo", "كوبرا": "Cobra", "كانتر": "Canter",
  "فايتر": "Fighter", "دايلي": "Daily", "ستراليس": "Stralis", "دوست": "Dost", "سفن": "Seven", "مافريك": "Maverick", "غوركا": "Gurkha",
  "ترافلر": "Traveller", "تيرالورد": "Terralord", "غراند تايغر": "Grand Tiger",
};

// Words inside short strings ("نيسان باترول مستعمل", "سيارات مستعملة في دبي").
const WORDS = {
  "مستعمل": "used", "مستعملة": "used", "سيارات": "cars", "في": "in", "وارد": "imported", "موديل": "model", "يوم": "days",
};

const PHRASES = (() => {
  const all = { ...WORDS, ...MODELS, ...UI };
  for (const [ar, slug] of Object.entries(MAKE_SLUGS)) all[ar] = makeEnglish(slug);
  return all;
})();
const KEYS = Object.keys(PHRASES).sort((a, b) => b.length - a.length);
const AR = /[؀-ۿ]/;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PHRASE_RE = new RegExp(`(?<![\\u0600-\\u06FF])(${KEYS.map(escapeRe).join("|")})(?![\\u0600-\\u06FF])`, "g");

// Whole-string patterns with numbers or names in them.
const PATTERNS = [
  [/^منذ (\d+) د$/, "$1 min ago"], [/^منذ (\d+) س$/, "$1 h ago"], [/^منذ (\d+) يوم$/, "$1 days ago"],
  [/^من (\d{4})$/, "From $1"], [/^إلى (\d{4})$/, "To $1"], [/^(\d{4}) وأحدث$/, "$1 or newer"],
  [/^أقل من ([\d,]+) كم$/, "Under $1 km"], [/^سيارات أقل من ([\d,]+) درهم$/, "Cars under AED $1"],
  [/^تمت إضافة (\d+) صور فقط \(الحد (\d+)\)$/, "Only $1 photos added (limit $2)"],
  [/^تم تجاهل (\d+) صورة لم نتعرف فيها على سيارة$/, "Skipped $1 photo(s) with no car in them"],
  [/^تعذر التحديث: ([\s\S]*)$/, "Couldn't update: $1"], [/^تعذر حذف البلاغات: ([\s\S]*)$/, "Couldn't delete the reports: $1"],
  [/^حُذف الإعلان، لكن تعذر حذف الصور: ([\s\S]*)$/, "Listing deleted, but the photos couldn't be deleted: $1"],
  [/^حذف الوسيط (.+)؟ إعلاناته تبقى بدون وسيط\.$/, "Delete dealer $1? Their listings stay, without a dealer."],
  [/^صار الإعلان مميز (\d+) أيام$/, "Listing featured for $1 days"], [/^⭐ تمييز (\d+) أيام$/, "⭐ Feature for $1 days"],
  [/^ينتهي بعد (\d+) يوم$/, "ends in $1 days"], [/^تم تجديد الإعلان (\d+) يومًا$/, "Listing renewed for $1 days"],
  [/^إعادة الإرسال بعد (\d+) ثانية$/, "Resend in $1 s"], [/^رقم الشاصي يتكون من 17 خانة، وكتبت (\d+)$/, "A VIN has 17 characters; you typed $1"],
];

// Page headings and titles of the browse sections (categoryCopy in seo-data.js).
const SECTION_PATTERNS = [
  [/^سيارات مستعملة للبيع في الإمارات$/, () => "Used cars for sale in the UAE"],
  [/^سيارات مستعملة للبيع في (.+)$/, (c) => `Used cars for sale in ${c}`],
  [/^سيارات مستعملة تحت ([\d,]+) درهم( في الإمارات)?$/, (n) => `Used cars under AED ${n}`],
  [/^(.+) مستعملة للبيع في الإمارات$/, (n) => `Used ${n} for sale in the UAE`],
  [/^سيارات (.+) للبيع في الإمارات$/, (n) => `Cars for sale from ${n}`],
  [/^سيارات (.+) على CarsUAE$/, (n) => `${n} cars on CarsUAE`],
  [/^سيارات (.+) للبيع$/, (n) => `Cars for sale from ${n}`],
];

const cache = new Map();
export function translate(text) {
  if (!text || !AR.test(text)) return text;
  if (cache.has(text)) return cache.get(text);
  const lead = text.match(/^\s*/)[0], trail = text.match(/\s*$/)[0];
  const core = text.trim();
  let out = PHRASES[core];
  if (out === undefined && / \| CarsUAE$/.test(core)) {
    const head = translate(core.replace(/ \| CarsUAE$/, ""));
    out = `${head} | CarsUAE`;
  }
  if (out === undefined) {
    for (const [re, fn] of SECTION_PATTERNS) {
      const m = core.match(re);
      if (m) { out = fn(...m.slice(1).map((x) => translate(x))); break; }
    }
  }
  if (out === undefined) {
    for (const [re, rep] of PATTERNS) if (re.test(core)) { out = core.replace(re, rep); break; }
  }
  if (out === undefined && core.length <= 140) {
    // Translate known words and names inside short strings; keep word order
    // for "<make> <model> مستعمل" style links readable.
    out = core.replace(PHRASE_RE, (m) => PHRASES[m]);
    out = out.replace(/^(.+) used$/i, "Used $1").replace(/^cars used in (.+)$/i, "Used cars in $1");
    // Longer text that still has Arabic left is a seller's own words: keep it as written.
    if (core.length > 40 && AR.test(out)) out = undefined;
  }
  const result = out === undefined ? text : lead + out + trail;
  cache.set(text, result);
  return result;
}

const ATTRS = ["placeholder", "aria-label", "title"];
function translateNode(node) {
  if (node.nodeType === 3) {
    if (node.parentElement && node.parentElement.closest("[data-no-i18n]")) return;
    const t = translate(node.nodeValue);
    if (t !== node.nodeValue) node.nodeValue = t;
    return;
  }
  if (node.nodeType !== 1) return;
  if (node.closest && node.closest("[data-no-i18n]")) return;
  for (const a of ATTRS) {
    const v = node.getAttribute && node.getAttribute(a);
    if (v && AR.test(v)) node.setAttribute(a, translate(v));
  }
  if (node.getAttribute && node.getAttribute("dir") === "rtl") node.setAttribute("dir", "ltr");
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => (n.nodeType === 1 && n.hasAttribute("data-no-i18n") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  let n = walker.nextNode();
  while (n) {
    if (n.nodeType === 3) {
      const t = translate(n.nodeValue);
      if (t !== n.nodeValue) n.nodeValue = t;
    } else {
      for (const a of ATTRS) {
        const v = n.getAttribute(a);
        if (v && AR.test(v)) n.setAttribute(a, translate(v));
      }
      if (n.getAttribute("dir") === "rtl") n.setAttribute("dir", "ltr");
    }
    n = walker.nextNode();
  }
}

// The language comes from the address: /en/... is English, anything else Arabic.
export function getLang() {
  try { return isEnPath(window.location.pathname) ? "en" : "ar"; } catch { return "ar"; }
}

// Same page in the other language.
export function otherLangHref() {
  const { pathname, search, hash } = window.location;
  const en = isEnPath(pathname);
  const base = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return (en ? base : langPath(base, true)) + search + hash;
}

export function switchLang() {
  window.location.assign(otherLangHref());
}

// Internal links and history entries keep the /en prefix in English mode.
const prefixPath = (url) => {
  if (typeof url !== "string" || !url.startsWith("/") || url.startsWith("//")) return url;
  if (isEnPath(url) || /^\/(api|assets|l|listings|media|promo)\//.test(url) || /\.[a-z0-9]{2,5}([?#]|$)/i.test(url)) return url;
  return url === "/" ? "/en" : url.replace(/^\/(?=[?#]|$)/, "/en").replace(/^\/(?!en(\/|$|[?#]))/, "/en/");
};

export function initI18n() {
  try {
    // Old preview links (?lang=en) move to the /en address.
    const url = new URL(window.location.href);
    const q = url.searchParams.get("lang");
    try { localStorage.removeItem("cm_lang"); } catch { /* ignore */ }
    if (q) {
      url.searchParams.delete("lang");
      const base = url.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
      url.pathname = langPath(base, q === "en");
      window.location.replace(url.toString());
      return;
    }
  } catch { /* ignore */ }
  if (getLang() !== "en") return;
  const html = document.documentElement;
  html.setAttribute("lang", "en");
  html.setAttribute("dir", "ltr");
  html.classList.add("cm-en");
  for (const fn of ["pushState", "replaceState"]) {
    const orig = window.history[fn].bind(window.history);
    window.history[fn] = (state, title, u) => orig(state, title, prefixPath(u));
  }
  const fixLinks = (root) => {
    const list = root.querySelectorAll ? root.querySelectorAll("a[href^='/']") : [];
    const all = root.matches && root.matches("a[href^='/']") ? [root, ...list] : list;
    all.forEach((a) => { if (a.closest("[data-no-i18n]")) return; const h = a.getAttribute("href"); const n = prefixPath(h); if (n !== h) a.setAttribute("href", n); });
  };
  const run = () => { translateNode(document.body); fixLinks(document.body); };
  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "characterData") translateNode(m.target);
      else if (m.type === "attributes") { if (m.attributeName === "href") fixLinks(m.target); else translateNode(m.target); }
      else m.addedNodes.forEach((n) => { translateNode(n); if (n.nodeType === 1) fixLinks(n); });
    }
    if (AR.test(document.title)) document.title = translate(document.title);
  });
  const start = () => {
    run();
    obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...ATTRS, "dir", "href"] });
  };
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
}
