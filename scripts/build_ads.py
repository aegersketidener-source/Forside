#!/usr/bin/env python3
"""Opprett reklame/manifest.json automatisk fra bildefilene i reklame/.

Ved nye reklamer: last opp .webp/.png/.jpg/.jpeg/.avif til reklame/.
Valgfri tittel og alttekst: legg til i reklame/metadata.json.
GitHub Actions kjører dette ved hver publisering, uten ekstra commits.
"""
import json
import sys
from pathlib import Path
from urllib.parse import quote

root=Path(__file__).resolve().parents[1]
images=root/'reklame'
supported={'.webp','.png','.jpg','.jpeg','.avif'}
metadata_file=images/'metadata.json'
extra=json.loads(metadata_file.read_text(encoding='utf-8')) if metadata_file.exists() else {}
if not isinstance(extra,dict):
    raise ValueError('reklame/metadata.json skal være et objekt')
records=[]
for f in sorted(images.iterdir(),key=lambda p:p.name.casefold()):
    if not f.is_file() or f.suffix.lower() not in supported or f.name.startswith('.'):
        continue
    info=extra.get(f.name,{})
    if not isinstance(info,dict):
        raise ValueError(f'Ugyldig metadata for {f.name}')
    basename=f.stem.replace('_',' ').replace('-',' ')
    title=info.get('navn') or basename.title()
    records.append({
        'id':f.stem,
        'navn':title,
        'bilde':'reklame/'+quote(f.name),
        'bildealt':info.get('bildealt') or 'Illustrert reklame for '+title+'.',
        'format':'illustrert-retroannonse'
    })
output=images/'manifest.json'
output.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Oppdatert {output.relative_to(root)}: {len(records)} annonser')
