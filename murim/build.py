#!/usr/bin/env python3
"""무림초출 빌드.

murim/ 아래에 나눠 둔 소스를 한 덩어리로 묶어 index.html 안에 넣는다.
  design/  겉모습(그림·색·배치)      game/  규칙과 진행      skin/  이미지로 갈아끼우는 곳(이미지를 넣고 빌드하면 반영)

쓰는 법:  python3 murim/build.py            → index.html 갱신
          python3 murim/build.py --test F   → 시험용 페이지를 F 로 따로 만든다(index.html 은 건드리지 않는다)
"""
import os, sys, json
from urllib.parse import quote
HERE = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(HERE, '..', 'index.html')
DESIGN = ['05_skin', '10_base', '20_props', '30_chars', '40_chib', '50_map', '60_icons']
GAME = ['20_stage_engine', '21_map_engine', '22_mapdata', '23_cathay', '30_items', '31_items_w1', '32_items_w2', '33_items_arm', '34_items_acc', '35_items_use', '36_arts', '40_duel', '45_war', '50_life', '60_events_a', '61_events_b', '62_grade', '63_minor_1', '63_minor_2', '63_minor_3', '63_minor_4', '63_minor_5', '63_minor_6', '63_minor_7', '63_minor_8', '63_minor_9', '63_minor_10', '63_minor_11', '64_events_c', '65_events_arts',
        '66_nemesis',
        '70_train', '71_episodes', '75_map', '76_world', '77_cathay', '78_sectlife', '80_stage', '81_ui', '82_card', '83_doll_data', '83_doll', '90_boot']
ORDER = ['game/10_core'] + ['design/' + n for n in DESIGN] + ['game/' + n for n in GAME]
START = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Song+Myung'
END = "<script>\n(function(){\n  const hub=document.getElementById('hub')"

def read(p):
    with open(os.path.join(HERE, p), encoding='utf-8') as f:
        return f.read().rstrip('\n')

IMG = ('.png', '.jpg', '.jpeg', '.webp', '.gif')

def skin_list(prefix):
    """skin/ 폴더의 이미지를 훑어 '이름(확장자 뺀 경로) → 주소' 목록을 만든다."""
    root, d = os.path.join(HERE, 'skin'), {}
    for dp, _, fs in os.walk(root):
        for f in sorted(fs):
            if f.lower().endswith(IMG):
                rel = os.path.relpath(os.path.join(dp, f), root).replace(os.sep, '/')
                d[os.path.splitext(rel)[0]] = prefix + quote(rel)
    return d

def block(hook='', skin_prefix='murim/skin/'):
    page = read('page.html').split('\n')
    css = read('design/murim.css')
    skins = skin_list(skin_prefix)
    js = 'const SKF=' + json.dumps(skins, ensure_ascii=False) + ';\n' + '\n'.join(read(p + '.js') for p in ORDER)
    return (page[0] + '\n<style>\n' + css + '\n</style>\n' + '\n'.join(page[1:]) + '\n\n<script>\n(function(){\n' + js + '\n' + hook + '})();\n</script>\n'), js

def main():
    with open(INDEX, encoding='utf-8') as f:
        base = f.read()
    i0, i1 = base.index(START), base.index(END)
    if '--test' in sys.argv:
        out = sys.argv[sys.argv.index('--test') + 1]
        html, js = block('window.__ev=c=>eval(c);\n', 'file://' + quote(os.path.join(HERE, 'skin')) + '/')
        with open(out, 'w', encoding='utf-8') as f:
            f.write(base[:i0] + html + base[i1:])
        with open(os.path.splitext(out)[0] + '.js', 'w', encoding='utf-8') as f:
            f.write('(function(){\n' + js + '\n})();\n')
        print('test build ->', out)
        return
    html, js = block()
    with open(INDEX, 'w', encoding='utf-8') as f:
        f.write(base[:i0] + html + base[i1:])
    print('index.html 갱신:', len(js), 'bytes js · 스킨 이미지', len(skin_list('')), '장')

if __name__ == '__main__':
    main()
