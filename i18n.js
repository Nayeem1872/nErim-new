import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./lang/en.json";
import fi from "./lang/fi.json";
import bn from "./lang/bn.json";
import arb from "./lang/arb.json"
import norway from "./lang/norway.json"
import africa from "./lang/africa.json"

i18next.use(initReactI18next).init({
    resources: {
        en: {translation: en},
        fi: { translation: fi },
        bn:{translation: bn},
        arb:{translation: arb},
        norway:{translation: norway},
        africa:{translation: africa}
    },
    lang: "en"
})

export default i18next;