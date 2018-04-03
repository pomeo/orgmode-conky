const org = require('org-mode-parser');

const colors = [
  {
    pattern: /(TODO)/g,
    color: '#ffaa88'
  },
  {
    pattern: /(DONE)/g,
    color: '#aaff88'
  },
  {
    pattern: /(CLOSED)/g,
    color: '#0295a9'
  },
  {
    pattern: /(DEADLINE)/g,
    color: '#FF6F69'
  },
  {
    pattern: /(SCHEDULED)/g,
    color: '#f8e2a8'
  }
]

function colorize(line) {
  const match = colors.find((obj) => {
    return obj.pattern.test(line);
  });
  if (match) {
    return line.replace(match.pattern, '${color ' + match.color + '}$1${color}')
  } else {
    return line;
  }
}

org.makelist(process.argv.slice(2)[0], (nodelist) => {
  const min = process.argv.slice(3)[0].split(',')[0] || 0;
  const max = process.argv.slice(3)[0].split(',')[1] || 100;
  let i = 0;
  nodelist.forEach(node => {
    let tags = '';
    if (Object.keys(node.tags).length) {
      tags = `:${Object.keys(node.tags).join(':')}:`;
    }
    if (i >= min && i < max) {
      if (node.todo) {
        console.log(`${'  '.repeat(node.level)} ${colorize(node.todo)} ${node.headline} ${tags}`);
      } else {
        console.log(`${'  '.repeat(node.level)} ${colorize(node.headline)} ${tags}`);
      }
    }
    i += 1;
    if (node.body) {
      node.body.split('\n').forEach(line => {
        if (line) {
          if (i >= min && i < max) {
            console.log(`${'  '.repeat(node.level + 1)} ${colorize(line)}`);
          }
          i += 1;
        }
      })
    }
    if (node.deadline) {
      if (i >= min && i < max) {
        console.log(`${'  '.repeat(node.level + 1)} ${colorize('DEADLINE')}: ${node.deadline}`);
      }
      i += 1;
    }
    if (node.scheduled) {
      if (i >= min && i < max) {
        console.log(`${'  '.repeat(node.level + 1)} ${colorize('SCHEDULED')}: ${node.scheduled}`);
      }
      i += 1;
    }
  });
});
