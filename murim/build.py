#!/usr/bin/env python3
"""무림초출 빌드.

murim/ 아래에 나눠 둔 소스를 한 덩어리로 묶어 index.html 안에 넣는다.
  design/  겉모습(그림·색·배치)      game/  규칙과 진행      skin/  이미지로 갈아끼우는 곳(빌드 없이 바로 반영)

쓰는 법:  python3 murim/build.py            → index.html 갱신
          python3 murim/build.py --test F   → 시험용 페이지를 F 로 따로 만든다(index.html 은 건드리지 않는다)
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(HERE, '..', 'index.html')
DESIGN = ['10_base', '20_props', '30_chars', '40_chib', '50_map', '60_icons']
GAME = ['20_stage_engine', '21_map_engine', '22_mapdata', '23_cathay', '30_items', '40_duel', '50_life', '60_events_a', '61_events_b',
        '70_train', '71_episodes', '75_map', '76_world', '80_stage', '81_ui', '90_boot']
ORDER = ['game/10_core'] + ['design/' + n for n in DESIGN] + ['game/' + n for n in GAME]
START = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Song+Myung'
END = "<script>\n(function(){\n  const hub=document.getElementById('hub')"

def read(p):
    with open(os.path.join(HERE, p), encoding='utf-8') as f:
        return f.read().rstrip('\n')

def block(hook=''):
    page = read('page.html').split('\n')
    css = read('design/murim.css')
    js = '\n'.join(read(p + '.js') for p in ORDER)
    return (page[0] + '\n<style>\n' + css + '\n</style>\n' + '\n'.join(page[1:]) + '\n\n<script>\n(function(){\n' + js + '\n' + hook + '})();\n</script>\n'), js

def main():
    with open(INDEX, encoding='utf-8') as f:
        base = f.read()
    i0, i1 = base.index(START), base.index(END)
    if '--test' in sys.argv:
        out = sys.argv[sys.argv.index('--test') + 1]
        html, js = block('window.__ev=c=>eval(c);\n')
        with open(out, 'w', encoding='utf-8') as f:
            f.write(base[:i0] + html + base[i1:])
        with open(os.path.splitext(out)[0] + '.js', 'w', encoding='utf-8') as f:
            f.write('(function(){\n' + js + '\n})();\n')
        print('test build ->', out)
        return
    html, js = block()
    with open(INDEX, 'w', encoding='utf-8') as f:
        f.write(base[:i0] + html + base[i1:])
    print('index.html 갱신:', len(js), 'bytes js')

if __name__ == '__main__':
    main()
