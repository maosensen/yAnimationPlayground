// biome-ignore-all lint/security/noDangerouslySetInnerHtml: blocking FOUC script, mirrors next-themes
import {
  DEFAULT_SETTINGS,
  FONT_VAR_MAP,
  SETTINGS_STORAGE_KEY,
} from "@/lib/settings/config";

/**
 * Blocking inline script injected into `<head>` to apply persisted settings
 * before first paint, preventing a flash of default theme (FOUC).
 *
 * Mirrors `SettingsEffect`, but runs synchronously from localStorage. Same
 * pattern `next-themes` uses for its `class` attribute, extended to the full
 * settings object. Defaults are baked in so the markup matches SSR output.
 */
export function SettingsScript() {
  const script = `(function(){try{
var d=document.documentElement;
var def=${JSON.stringify(DEFAULT_SETTINGS)};
var fonts=${JSON.stringify(FONT_VAR_MAP)};
var s=def;
var raw=localStorage.getItem(${JSON.stringify(SETTINGS_STORAGE_KEY)});
if(raw){var p=JSON.parse(raw);if(p&&p.state){s=Object.assign({},def,p.state);
var v=p.version||0;
if(v<1&&s.fontFamily==="public-sans"){s.fontFamily="outfit";}
if(v<2&&s.navColor==="apparent"){s.navColor="integrate";}}}
d.dataset.contrast=s.contrast?"high":"normal";
d.dataset.compact=s.compact?"true":"false";
d.dataset.maxWidth=s.maxWidth?"true":"false";
d.dataset.layout=s.navLayout;
d.dataset.nav=s.navColor;
d.dataset.preset=s.preset;
d.dataset.neutral=s.neutral||def.neutral;
d.style.setProperty("--font-sans",fonts[s.fontFamily]||fonts[def.fontFamily]);
d.style.setProperty("--font-size-base",s.fontSize+"px");
d.style.setProperty("--radius",(typeof s.radius==="number"?s.radius:def.radius)+"rem");
if(s.preset==="custom"&&s.customVars){for(var k in s.customVars){d.style.setProperty(k,s.customVars[k]);}}
}catch(e){}})();`;

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
