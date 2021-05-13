import {yellow, white, green, red} from 'kleur';

type Messages = string | string[];
type Options = {
  inline: boolean;
};

const kleur = (messages: Messages, color, options?: Options) => {
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

export const create = (...arg) => {
  console.log(`${green('生成')} ${arg.join(' ')}`);
};

export const build = (...arg) => {
  console.log(`${yellow('编译')} ${arg.join(' ')}`);
};

export const copy = (...arg) => {
  console.log(`${white('拷贝')} ${arg.join(' ')}`);
};

export const remove = (...arg) => {
  console.log(`${red('删除')} ${arg.join(' ')}`);
};
