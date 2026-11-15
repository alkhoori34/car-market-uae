// Guide text under the VIN check tool (/vin-check). "رقم الشاصي" is the
// site's top Google search term, so the page needs real content around the
// tool, not just the input box. Same block format as src/articles.js; rendered
// by VinCheck in App.jsx and vinPage() in api/page.js (FAQ also as FAQPage
// JSON-LD). Keep the two languages in step.

export const VIN_GUIDE_AR = [
  ["h2", "ما هو رقم الشاصي (VIN)؟"],
  ["p", "رقم الشاصي، ويسمى أيضًا رقم الهيكل أو VIN (Vehicle Identification Number)، هو رقم من 17 خانة (حروف وأرقام) تعطيه الشركة المصنعة لكل سيارة، ولا يتكرر بين سيارتين في العالم. هو مثل الهوية للسيارة: يبيّن من صنعها وأين ومتى، ومواصفاتها الأساسية من المصنع."],
  ["p", "رقم الشاصي لا يحتوي على الحروف I و O و Q حتى لا تختلط بالأرقام 1 و 0. إذا رأيت أحدها في الرقم فغالبًا في خطأ في الكتابة."],
  ["h2", "وين ألقى رقم الشاصي في السيارة؟"],
  ["ul", [
    "في ملكية السيارة (الكارت) تحت خانة رقم الشاصي.",
    "أسفل الزجاج الأمامي من جهة السائق، يُقرأ من خارج السيارة.",
    "على ملصق في عمود باب السائق من الداخل.",
    "محفور على الهيكل في مقدمة السيارة أو تحت غطاء المحرك في كثير من الموديلات.",
  ]],
  ["tip", "قبل الشراء طابق رقم الشاصي في الملكية مع الرقم على الزجاج وعلى الباب. أي اختلاف أو آثار حك وتعديل على الرقم سبب كافٍ لتترك السيارة."],
  ["h2", "وش معنى خانات رقم الشاصي؟"],
  ["ul", [
    "الخانات 1 إلى 3: الشركة المصنعة وبلد الصنع. الخانة الأولى تدل على البلد: J اليابان، K كوريا، L الصين، W ألمانيا، S بريطانيا، Z إيطاليا، 1 و4 و5 أمريكا، 2 كندا، 3 المكسيك.",
    "الخانات 4 إلى 8: وصف السيارة من المصنع، مثل الموديل ونوع الهيكل والمحرك.",
    "الخانة 9: رقم تحقق يحسب من باقي الخانات، ويكشف الأرقام المكتوبة غلط أو المزورة في السيارات الأمريكية.",
    "الخانة 10: سنة الموديل. مثال: A تعني 2010، F تعني 2015، L تعني 2020، P تعني 2023، R تعني 2024، S تعني 2025، T تعني 2026.",
    "الخانة 11: المصنع الذي جُمّعت فيه السيارة.",
    "الخانات 12 إلى 17: الرقم التسلسلي للسيارة نفسها.",
  ]],
  ["h2", "وش يكشف فحص رقم الشاصي، ووش ما يكشف؟"],
  ["p", "الفحص المجاني في الأعلى يقرأ بلد الصنع والشركة وسنة الموديل، ويجيب مواصفات المصنع (المحرك، ناقل الحركة، نظام الدفع، عدد الأبواب) ونداءات الاستدعاء إذا كانت السيارة من السوق الأمريكي."],
  ["p", "لكن رقم الشاصي وحده لا يكشف الحوادث ولا الممشى الحقيقي ولا إذا كانت السيارة خليجية أو وارد. لهذي الأمور اطلب من البائع سجل الصيانة من الوكالة، واسأل وكيل الماركة في الإمارات برقم الشاصي، وافحص السيارة في مركز فحص معتمد قبل ما تدفع."],
  ["cta", { text: "عندك سيارة تبي تبيعها؟ انشر إعلانك مجانًا على CarsUAE.", label: "انشر سيارتك مجانًا", href: "#sell" }],
  ["h2", "أسئلة شائعة عن رقم الشاصي"],
  ["faq", [
    ["كم خانة في رقم الشاصي؟", "17 خانة من الحروف والأرقام لكل السيارات المصنوعة من سنة 1981 وما بعدها."],
    ["هل فحص رقم الشاصي في CarsUAE مجاني؟", "نعم، الفحص مجاني بالكامل وبدون تسجيل. اكتب الرقم واضغط «افحص»."],
    ["هل أعرف من رقم الشاصي إذا السيارة خليجية أو وارد؟", "لا يكفي وحده. بلد الصنع لا يعني بلد البيع، فكثير من السيارات الخليجية تُصنع في أمريكا أو اليابان. اسأل وكيل الماركة في الإمارات برقم الشاصي، فهو يعرف إذا بيعت السيارة عنده."],
    ["هل يكشف رقم الشاصي الحوادث؟", "الفحص المجاني لا يكشف الحوادث. افحص السيارة في مركز فحص معتمد واطلب سجل الصيانة من الوكالة قبل الشراء."],
    ["ليش الفحص ما يطلع مواصفات سيارتي؟", "قاعدة البيانات المجانية تغطي سيارات السوق الأمريكي بشكل كامل، وبعض السيارات الخليجية واليابانية تطلع بمعلومات أقل. بلد الصنع والشركة وسنة الموديل تظهر دائمًا لأنها مقروءة من الرقم نفسه."],
  ]],
];

export const VIN_GUIDE_EN = [
  ["h2", "What is a VIN (chassis number)?"],
  ["p", "The VIN (Vehicle Identification Number), called the chassis number (رقم الشاصي) in the UAE, is a 17-character code of letters and digits that the maker gives every car. No two cars share one. It works like the car's ID: it shows who built it, where and when, and its basic factory specs."],
  ["p", "A VIN never contains the letters I, O or Q, so they can't be confused with 1 and 0. If you see one, the number was probably copied wrong."],
  ["h2", "Where do I find the VIN on the car?"],
  ["ul", [
    "On the car's registration card (mulkiya), in the chassis number field.",
    "At the bottom of the windscreen on the driver's side, readable from outside.",
    "On a sticker inside the driver's door pillar.",
    "Stamped on the body at the front of the car or under the bonnet on many models.",
  ]],
  ["tip", "Before you buy, match the VIN on the mulkiya with the one on the windscreen and the door. Any mismatch, or signs of scratching or tampering, is reason enough to walk away."],
  ["h2", "What do the VIN characters mean?"],
  ["ul", [
    "Characters 1 to 3: the maker and country of manufacture. The first one shows the country: J Japan, K Korea, L China, W Germany, S UK, Z Italy, 1, 4 and 5 USA, 2 Canada, 3 Mexico.",
    "Characters 4 to 8: the factory description of the car, such as model, body type and engine.",
    "Character 9: a check digit calculated from the others, which catches mistyped or fake numbers on US-market cars.",
    "Character 10: the model year. For example A is 2010, F 2015, L 2020, P 2023, R 2024, S 2025, T 2026.",
    "Character 11: the plant where the car was assembled.",
    "Characters 12 to 17: the serial number of the car itself.",
  ]],
  ["h2", "What a VIN check shows, and what it doesn't"],
  ["p", "The free check above reads the country, maker and model year, and pulls the factory specs (engine, transmission, drive, doors) and safety recalls when the car is a US-market model."],
  ["p", "A VIN on its own doesn't reveal accidents, the real mileage, or whether the car is GCC spec or imported. For those, ask the seller for the dealer service record, ask the brand's UAE dealer with the VIN, and have the car inspected at an approved centre before you pay."],
  ["cta", { text: "Have a car to sell? List it free on CarsUAE.", label: "Sell your car for free", href: "#sell" }],
  ["h2", "VIN questions"],
  ["faq", [
    ["How many characters does a VIN have?", "17 letters and digits, for every car built from 1981 on."],
    ["Is the CarsUAE VIN check free?", "Yes, it's completely free and needs no sign-up. Type the number and press Check."],
    ["Can the VIN tell me if a car is GCC spec or imported?", "Not on its own. The country of manufacture isn't the country of sale: many GCC cars are built in the US or Japan. Ask the brand's UAE dealer with the VIN; they know if the car was sold through them."],
    ["Does the VIN show accidents?", "The free check doesn't show accidents. Have the car inspected at an approved centre and ask for the dealer service record before buying."],
    ["Why doesn't the check show my car's specs?", "The free database fully covers US-market cars; some GCC and Japanese cars return less. The country, maker and model year always show, because they are read from the number itself."],
  ]],
];

// Articles linked under the guide (slugs from src/articles.js).
export const VIN_RELATED = [
  "used-car-inspection-checklist",
  "gcc-vs-american-specs",
  "used-car-scam-signs-uae",
  "flood-damaged-used-car-uae",
];

export const vinGuideIn = (en) => (en ? VIN_GUIDE_EN : VIN_GUIDE_AR);
