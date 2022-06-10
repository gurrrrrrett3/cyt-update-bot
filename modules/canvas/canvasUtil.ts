export type ValidColorCode =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f";

export type ValidFormatCode = "k" | "l" | "m" | "n" | "o" | "r";

export interface ConvertedFormatInstance {
  text: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  obfuscated: boolean;
}

export default class CanvasUtil {
  //Static color codes
  public static colorCodes = {
    "0": "#000000",
    "1": "#0000AA",
    "2": "#00AA00",
    "3": "#00AAAA",
    "4": "#AA0000",
    "5": "#AA00AA",
    "6": "#FFAA00",
    "7": "#AAAAAA",
    "8": "#555555",
    "9": "#5555FF",
    a: "#55FF55",
    b: "#55FFFF",
    c: "#FF5555",
    d: "#FF55FF",
    e: "#FFFF55",
    f: "#FFFFFF",
  };

  public static getColorCodes(text: string) {
    return text.replace(/\&([0-9a-f])/g, (match, color: ValidColorCode) => {
      return `[${CanvasUtil.colorCodes[color]}]`;
    });
  }

  public static getHexCodes(text: string) {
    //format: &#rrggbb
    return text.replace(/\&#([0-9a-f]{6})/g, (match, color: string) => {
      return `[#${color}]`;
    });
  }

  public static getFormatCodes(text: string) {
    return text.match;
  }

  public static convertMinecraftFormat(text: string) {
    let out: ConvertedFormatInstance[] = [];
    let current: ConvertedFormatInstance = {
        text: "",
        color: "",
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        obfuscated: false,
    };

   
    
  }

  public static splitGroups(text: string) {

    /*
    Text is split into groups of text and format codes
    
    Example:
    "&0Hello &lWorld"
    [
        {
            text: "Hello ",
            format: &0
        },
        {
            text: "World",
            format: &l
        }
    ]

    Text can have multiple format codes, but the last color code overrides the previous one
    Example:
    "&0&bHello &lWorld"

    The b code overrides the 0 code
    
    Other Examples:
    "&l&m&aHello &lWorld"
    "&#00ffbbHello &l&aWorld"
    */

    let out: { text: string; format: string }[] = [];


    
    let groups = text.split("&");
    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let format = "";
        let text = group;
    
        if (group.length == 1 && group.match(/[0-9a-fk-or]/)) {
            //format or color code
            format = `&${group}`;
        } else if (group.length == 7 && group.match(/\#[0-9a-f]{6}/)) {
            //hex code
            format = `&#${group}`;
    
        out.push({
            text,
            format,
        });
        }

    }

  }
}

