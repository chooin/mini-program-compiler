import {yellow, white, green, red, Color} from 'kleur';

type Messages = string | string[];
type Options = {
  inline: boolean;
};

const kleur = (messages: Messages, color: Color, options?: Options) => {
  if (Array.isArray(messages)) {
    if (options && options.inline) {
      console.log(color(messages.join(' ')));
    } else {
      messages.forEach((message) => {
        console.log(color(message));
      });
    }
  } else {
    console.log(color(messages));
  }
};

export const log = (messages: Messages, options?: Options) => {
  kleur(messages, white, options);
};

export const info = (messages: Messages, options?: Options) => {
  kleur(messages, white, options);
};

export const success = (messages: Messages, options?: Options) => {
  kleur(messages, green, options);
};

export const warning = (messages: Messages, options?: Options) => {
  kleur(messages, yellow, options);
};

export const error = (messages: Messages, options?: Options) => {
  kleur(messages, red, options);
};

export const create = (...arg: string[]) => {
  console.log(`${green('生成')} ${arg.join(' ')}`);
};

export const build = (...arg: string[]) => {
  console.log(`${yellow('编译')} ${arg.join(' ')}`);
};

export const copy = (...arg: string[]) => {
  console.log(`${white('拷贝')} ${arg.join(' ')}`);
};

export const remove = (...arg: string[]) => {
  console.log(`${red('删除')} ${arg.join(' ')}`);
};
