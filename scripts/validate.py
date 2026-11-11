#!/usr/bin/env python3
"""Validerer redaksjonelle JSON-data for Ægerske Tidender (kun Python-standardbibliotek)."""
from pathlib import Path
import json, sys, datetime
root=Path(__file__).resolve().parents[1]
def load(filename):
    with (root/'data'/filename).open(encoding='utf-8') as fp:return json.load(fp)
errors=[]
for filename in ('artikler.json','journalister.json','emneregister.json','steder.json','natur_og_turhytter.json'):
    try:load(filename)
    except (OSError,ValueError) as e:errors.append(f'{filename}: {e}')
if errors:
    for error in errors:print('FEIL:',error)
    sys.exit(1)
items=load('artikler.json');reporters={r['id'] for r in load('journalister.json')};topics={(e['hovedkategori'],e['underkategori']) for e in load('emneregister.json')['emner']}
ids=set()
required=('id','tittel','ingress','tekst','hovedkategori','underkategori','journalist_id','sted','publisert','bilde','bildealt','tags')
for i,a in enumerate(items):
    for k in required:
        if not a.get(k):errors.append(f'artikkel {i}: feltet {k} mangler eller er tomt')
    slug=a.get('id')
    if slug in ids:errors.append(f'dobbel artikkel-ID {slug}')
    ids.add(slug)
    if a.get('journalist_id') not in reporters:errors.append(f'{slug}: ukjent journalist-ID')
    if (a.get('hovedkategori'),a.get('underkategori')) not in topics:errors.append(f'{slug}: hoved-/underkategori finnes ikke i emneregisteret')
    try:datetime.datetime.fromisoformat(a['publisert'])
    except (ValueError,KeyError):errors.append(f'{slug}: ugyldig ISO-dato')
    if not isinstance(a.get('tekst'),list) or not all(isinstance(x,str) for x in a['tekst']):errors.append(f'{slug}: tekst må være liste med avsnitt')
    if a.get('bilde') and not (root/a['bilde']).is_file():errors.append(f'{slug}: bildefil {a["bilde"]} mangler')
ad_manifest=root/'reklame'/'manifest.json'
try:
    ads=json.loads(ad_manifest.read_text(encoding='utf-8'))
    if len({a['id'] for a in ads})!=len(ads):errors.append('reklame: dupliserte ID-er')
    for ad in ads:
        if not (root/ad['bilde']).is_file():errors.append(f'reklamebildet mangler: {ad["bilde"]}')
except (OSError,ValueError,KeyError) as e:
    errors.append(f'annonsemanifest: {e}')
    ads=[]
for person in load('journalister.json'):
    if person.get('bilde') and not (root/person['bilde']).is_file():
        errors.append(f'byline: {person["id"]} mangler bilde {person["bilde"]}')

if errors:
    for e in errors:print('FEIL:',e)
    sys.exit(1)
print(f'OK: {len(items)} artikler, {len(reporters)} journalister, {len(topics)} emner og {len(ads)} annonser.')
