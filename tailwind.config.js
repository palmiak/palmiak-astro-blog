/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      fontFamily: {
        "display": ['"Unbounded"', "sans-serif"],
        "serif": ['"Instrument Serif"', "serif"],
        "mono": ['"IBM Plex Mono"', "monospace"],
        "sans": ['"Inter"', "sans-serif"],
        // Legacy aliases kept for backward compat during transition
        "palmiak-font": ['"Inter"', "sans-serif"],
        "palmiak-font-title": ['"Unbounded"', "sans-serif"],
      },
      colors: {
        "bg":    "#0b0b0e",
        "bg1":   "#111116",
        "hi":    "#eaeaf0",
        "mid":   "#9898b0",
        "dim":   "#52526a",
        "pk":    "#ff2d78",
        "vi":    "#a855f7",
        "gr":    "#00ffb3",
        // Legacy colors kept during transition
        "palmiak_pink":      "#F027A6",
        "palmiak_blue":      "#16E6F3",
        "palmiak_green":     "#A05FE0",
        "palmiak_bg":        "#0b0b0e",
        "palmiak_lime":      "#b0d959",
        "palmiak_limedark":  "#7fa331",
        "palmiak_lightdark": "#231F52",
        "palmiak_deepdark":  "#0F0E14",
      },
    },
  },
};
