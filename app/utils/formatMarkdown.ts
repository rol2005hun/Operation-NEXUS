import { marked } from 'marked';

const universalClassExtension = {
  name: 'universalClass',
  level: 'inline' as const,
  start(src: string) {
    return src.match(/::/)?.index;
  },
  tokenizer(src: string) {
    const rule = /^::(\w+)\{([^}]*)\}([^:]*)::/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'universalClass',
        raw: match[0],
        element: match[1],
        className: match[2],
        text: match[3]
      };
    }
  },
  renderer(token: UniversalClassToken) {
    const allowedElements = [
      'span', 'strong', 'em', 'code', 'mark', 'small', 'sub', 'sup',
      'del', 'ins', 'kbd', 'samp', 'var', 'abbr', 'cite', 'dfn',
      'time', 'data', 'output', 'div', 'section'
    ];

    const element = allowedElements.includes(token.element.toLowerCase())
      ? token.element.toLowerCase()
      : 'span';

    const classAttr = token.className ? ` class="${token.className}"` : '';

    const processedText = marked.parseInline(token.text);

    return `<${element}${classAttr}>${processedText}</${element}>`;
  }
};

const shortClassExtension = {
  name: 'shortClass',
  level: 'inline' as const,
  start(src: string) {
    return src.match(/\{/)?.index;
  },
  tokenizer(src: string) {
    const rule = /^\{([^}]*)\}([^{]*)\{\/\}/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'shortClass',
        raw: match[0],
        className: match[1],
        text: match[2]
      };
    }
  },
  renderer(token: ShortClassToken) {
    const classAttr = token.className ? ` class="${token.className}"` : '';
    const processedText = marked.parseInline(token.text);

    return `<span${classAttr}>${processedText}</span>`;
  }
};

export const formatMarkdown = (
  content: string,
  useCustomClasses: boolean = true,
  options: { breaks?: boolean; gfm?: boolean } = {}
): string => {
  if (!content) return '';

  try {
    if (useCustomClasses) {
      marked.use({
        extensions: [universalClassExtension, shortClassExtension]
      });
    }

    const result = marked(content, {
      breaks: options.breaks ?? false,
      gfm: options.gfm ?? true
    });

    if (typeof result === 'string') {
      return result;
    } else {
      console.warn('Markdown parsing returned a Promise, using fallback formatting');
      throw new Error('Async parsing not supported');
    }
  } catch (error) {
    console.error('Error parsing markdown:', error);

    let formatted = content.replace(/\n/g, '<br>');
    formatted = formatted.replace(/(<br>\s*){2,}/g, '</p><p>');
    formatted = `<p>${formatted}</p>`;
    formatted = formatted.replace(/<p><\/p>/g, '');
    formatted = formatted.replace(/<p><br><\/p>/g, '');

    return formatted;
  }
};