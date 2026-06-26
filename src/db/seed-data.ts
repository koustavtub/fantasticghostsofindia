import { db } from './index';
import { ghosts, type NewGhost } from './schema';

const seedEntries: NewGhost[] = [
  {
    slug: 'chudail',
    name: 'Chudail',
    alternateNames: ['Churel', 'Churail', 'Jakhin'],
    region: 'North India',
    gender: 'Female',
    summary: 'A vengeful female spirit born from women who died during childbirth or pregnancy, recognisable by her backward-facing feet.',
    appearance: 'Often depicted as a beautiful woman from the front, with long black hair, pale skin, and feet that turn completely backward. Some accounts describe a skeletal or emaciated form beneath illusory beauty.',
    behavior: 'Haunts crossroads, banyan trees, and cremation grounds after dark. Lures travellers with cries mimicking a child or distressed woman. Known to drain life force from men who follow her.',
    lore: `The Chudail arises from the tragic death of a woman during pregnancy, childbirth, or at the hands of family. In village lore across Uttar Pradesh, Rajasthan, and Punjab, she is both feared and pitied — a spirit denied the rites of proper burial.

She is said to dwell in **Peepal** and **Banyan** trees, descending when the moon is thin. Her backward feet are the surest sign of her true nature; those who notice may escape, but those who do not are seldom seen again.

In some traditions, the Chudail can be appeased through offerings left at crossroads, though brahmins warn that sympathy alone cannot always calm her hunger for justice.`,
    protection: 'Sprinkle mustard seeds or scatter rice — she must count each grain before pursuing. Iron nails driven into doorframes, vermillion on thresholds, and recitation of Hanuman Chalisa are widely trusted. Never follow a lone woman’s voice after sunset near a cremation ground.',
    tags: ['female', 'vengeful', 'crossroads', 'childbirth', 'rural'],
    images: [],
  },
  {
    slug: 'bhoot',
    name: 'Bhoot',
    alternateNames: ['Bhoota', 'Bhuta', 'Atma'],
    region: 'Pan-India',
    gender: 'Variable',
    summary: 'The generic restless dead — spirits of those who died violently, by suicide, or without proper funeral rites.',
    appearance: 'Varies by region: sometimes a shadow without feet, sometimes a pale figure in white shroud (*kafan*). Often associated with a faint glow or cold mist.',
    behavior: 'Wanders places tied to death — old wells, abandoned houses, battlefields. May knock, whisper names, or possess the weak-willed. Generally more nuisance than predator unless provoked.',
    lore: `*Bhoot* is among the broadest terms in Indian ghost lore — any disembodied spirit may be called a bhoot, though specialists distinguish pretas, pisachas, and others.

They are thought to linger when **antim sanskar** (last rites) are incomplete, when death comes suddenly, or when the deceased bears unresolved guilt. Villages near old stepwells (*baoli*) and forsaken havelis maintain stories of bhoots who never found rest.

Unlike malevolent demons, many bhoots simply repeat the circumstances of their death — walking the same path, crying at the same hour — until a priest performs *shanti* rituals.`,
    protection: 'Complete funeral rites and annual *shradh* offerings. Salt lines at windows, burning *loban* (frankincense), and keeping a lamp lit during *pitru paksha* are common household protections.',
    tags: ['restless-dead', 'generic', 'funeral-rites', 'village'],
    images: [],
  },
  {
    slug: 'pret',
    name: 'Pret',
    alternateNames: ['Preta', 'Pretatma'],
    region: 'Pan-India',
    gender: 'Variable',
    summary: 'Hungry ghosts condemned by karma to suffer insatiable thirst and hunger — often with grotesquely enlarged bellies and pinhole mouths.',
    appearance: 'Described in scriptures as emaciated limbs with a swollen abdomen, neck thin as a needle, and a mouth too small to eat. Some folk depictions simplify this to a hunched, starving figure.',
    behavior: 'Clusters near temples, rivers, and places of impurity. Cannot consume offerings meant for the living; steals scent of incense and essence of food instead. May harass descendants who neglect *shradh*.',
    lore: `In the *Garuda Purana* and Buddhist *Preta* lore, pretas occupy a liminal realm between human and demon — punished not by Yama’s court alone but by the weight of their own attachments.

They are especially active during **Pitru Paksha**, when the veil between worlds thins. Families who forget ancestral offerings risk pretas visiting in dreams, demanding water and rice.

Some pretas were misers in life; others died with unfulfilled cravings. A few tales tell of pretas eventually released through charity performed in their name.`,
    protection: 'Offer water (*tarpan*), sesame, and cooked rice during Pitru Paksha. Donate food at temples in the ancestor’s name. Priests may perform *Narayan Bali* for severe hauntings tied to pretas.',
    tags: ['hungry-ghost', 'karma', 'ancestral', 'scriptural'],
    images: [],
  },
  {
    slug: 'mohini',
    name: 'Mohini',
    alternateNames: ['Mohini Pret', 'Enchantress Spirit'],
    region: 'West India',
    gender: 'Female',
    summary: 'A seductive female apparition who enchants men to their ruin — distinct from the divine Mohini avatar of Vishnu.',
    appearance: 'Irresistibly beautiful woman in fine silk or jasmine garlands, sometimes visible only from certain angles. Mirrors may fail to reflect her.',
    behavior: 'Appears near rivers, mango groves, or lonely roads. Seduces travellers, leading them into ponds, cliffs, or exhaustion. Victims may return changed — hollow-eyed, unable to speak coherently.',
    lore: `Folk Mohini must not be confused with Lord Vishnu’s *Mohini* form, though both wield allure as weapon. Village women warn sons away from mango orchards after dusk where a Mohini is said to dance to flute music no human plays.

In Konkan and Malabar coast stories, fishermen speak of lights over the water — a Mohini combing hair on a rock, beckoning boats closer.

She embodies the danger of desire unchecked, and older tellings suggest she was once a woman wronged in life, transformed by betrayal into eternal temptress.`,
    protection: 'Carry iron or a iron nail; Mohinis are said to fear cold metal. Chant protective mantras before travel. Never accept food or water from a lone beautiful stranger on a deserted road.',
    tags: ['seductive', 'female', 'water', 'coastal', 'enchantment'],
    images: [],
  },
  {
    slug: 'pishacha',
    name: 'Pishacha',
    alternateNames: ['Pisacha', 'Pisach'],
    region: 'North India',
    gender: 'Variable',
    summary: 'Flesh-eating demons of darkness who haunt cremation grounds and corrupt the mind — among the most feared supernatural beings.',
    appearance: 'Dark-skinned or shadow-bodied, with bulging veins, red eyes, and long canine teeth. Some texts describe them as goblin-like with the ability to change shape.',
    behavior: 'Active after sunset, especially on new moon nights. Feeds on corpses and living flesh. Can possess humans, causing madness, gluttony, and violent impulses.',
    lore: `The *Atharvaveda* and later Puranic literature place pishachas among the progeny of Kashyapa and Krodhavasa, dwelling in charnel grounds and desolate forests.

They are not merely ghosts but a distinct race of beings — cruel, cunning, and difficult to exorcise. Tantric traditions both ward against them and, in forbidden rites, invoke their power.

Kings once posted guards at cremation grounds not only for thieves but for pishachas drawn to unburnt offerings and improperly disposed bodies.`,
    protection: 'Avoid cremation grounds after dark. *Hanuman* worship, *Gayatri mantra*, and ash from sacred fire (*vibhuti*) on the forehead. Exorcism by qualified priests for possession cases.',
    tags: ['demon', 'cannibal', 'cremation-ground', 'possession', 'vedic'],
    images: [],
  },
  {
    slug: 'vetala',
    name: 'Vetala',
    alternateNames: ['Betaal', 'Vetal', 'Baital'],
    region: 'West India',
    gender: 'Male',
    summary: 'Spirits that inhabit corpses hanging from trees — immortalised in the Vikram-Vetala tales as riddling, cunning beings.',
    appearance: 'A corpse possessed with unnatural agility — grinning, red-eyed, sometimes perched upside-down on branches. Retains the decaying body of its host.',
    behavior: 'Hops with corpses, laughs at human folly, and poses riddles to those who would capture it. Can grant uncanny knowledge of past and future at a terrible price.',
    lore: `The twenty-five tales of **Vikramaditya and the Vetala** (popularised as *Betaal Pachisi*) cemented the vetala as India’s most literary ghost — witty, philosophical, and bound to the king who carries its corpse in silence.

Vetalas occupy corpses not yet cremated, especially those of criminals hung from **Margosa** trees. They know secrets of kings and commoners alike, trading answers only if the listener breaks a vow.

Unlike mindless bhoots, the vetala chooses when to speak — and its riddles often expose human hypocrisy.`,
    protection: 'Cremate the dead promptly; do not leave corpses exposed. For those who seek a vetala (in occult tradition), iron chains and mantras of *Kali* are used — not recommended for the untrained.',
    tags: ['corpse-possession', 'riddles', 'literary', 'western-india', 'cunning'],
    images: [],
  },
  {
    slug: 'brahmarakshasa',
    name: 'Brahmarakshasa',
    alternateNames: ['Brahma Rakshasa', 'Rakshasa Brahmin', 'Brahmadaitya', 'Bromhodaityo', 'Brahmdaityo'],
    region: 'Pan-India',
    gender: 'Male',
    summary: 'The ghost of a learned Brahmin who misused sacred knowledge — enormously powerful and hungry for ritual offerings. In Bengal, the milder Brahmadaitya is often counted as a refined cousin of the same curse.',
    appearance: 'Monstrous form with matted hair, protruding fangs, and the sacred thread (*janeu*) still visible across a hairy chest. May appear initially as a dignified pandit before revealing true shape.',
    behavior: 'Haunts ancient temples, libraries, and banyan groves. Demands elaborate food offerings; punishes those who interrupt rituals. Can curse entire lineages.',
    lore: `## Origin and the fall from dharma

When a Brahmin scholar dies while clinging to pride, misusing mantras for personal gain, or denying proper rites, he may rise as a **Brahmarakshasa** — retaining Vedic knowledge but stripped of humanity.

The *Garuda Purana* lists several paths to this fate: performing rites for payment alone, teaching the Vedas to the unworthy, breaking vows of celibacy, or dying violently before funeral rites are complete. In either case, the soul does not pass cleanly into ancestral rest; it lingers with every shloka memorised in life, now bent toward hunger, wrath, and dominion.

### Two roads to the same tree

Folklore disagrees on which sin matters most. In western and Deccan tellings, **misuse of knowledge** is paramount — the scholar who sold mantras or cursed villages from arrogance. In other accounts, any **unnatural death** (*akal mrityu*) of a learned Brahmin suffices: murder, suicide, accident, or burial without proper *antim sanskar*. Both traditions agree on the outcome: a being that remembers how to chant, but no longer remembers mercy.

## Chained beneath the temple

Temple chronicles in **Varanasi** and **Ujjain** record such beings chained by earlier *shankaracharyas* beneath stone slabs, fed daily offerings to prevent wrath.

In Kerala, the Thirunakkara Shiva temple at Kottayam maintains a separate shrine where a Brahmarakshasa idol receives oil lamps and food — not worshipped as a god, but appeased as a dangerous guardian of sacred ground. Similar outer-wall idols appear across Maharashtra and Karnataka; villagers leave rice and lamp-black at dusk rather than invite a scholar-ghost’s attention inside the sanctum.

### Mayurbhatta and the peepal tree

A seventh-century legend ties the poet **Mayurbhatta** to a Brahmarakshasa at the Deo Sun Temple in Bihar. The spirit hung inverted from a peepal tree, repeating every verse of the *Surya Shataka* as Mayurbhatta composed it — an uncanny echo of stolen scholarship. The poet finally recited through his nose; lacking a nose, the being fled, and the tree withered. The tale captures the Brahmarakshasa’s curse: immense learning deployed as pure obstruction.

## Rank among spirits

They occupy a terrifying middle rank: neither common *bhoot* nor cosmic *asura*, but a fallen sage whose hunger for *brahmins’* respect persists beyond death.

Unlike the hungry *preta* or the flesh-eating *pishacha*, the Brahmarakshasa retains ritual status — the sacred thread may still hang across a hairy chest, fangs notwithstanding. Some stories grant them power to **bestow boons** as well as curses; kings and ascetics who pleased a Brahmarakshasa received gold or secret knowledge, though the price was seldom small.

## Brahmarakshasa and Brahmadaitya

Across the subcontinent, the learned dead are not told one way. In **Bengali folklore**, the **Brahmadaitya** (*Bromhodaityo*, *Brahmdaityo*) is often described as the **elite among ghosts** — the “king of kings” whom other spirits respect.

| | Brahmarakshasa | Brahmadaitya |
|---|---|---|
| **Region** | Pan-India; strong in Puranic and Deccan lore | Bengal and eastern traditions |
| **Temperament** | Fierce, demanding, potentially cannibal | Refined, often benign; “a bit obnoxious” |
| **Appearance** | Monstrous: fangs, matted hair, horns in some accounts | Fair, tall, saint-like feet; dhoti, *janeu*, hookah on a banyan |
| **Diet** | Elaborate offerings; may hunger for the living | Strict vegetarian; Brahminical purity maintained |
| **Role in stories** | Curses lineages, guards forbidden knowledge | Helps woodcutters, grants magic gifts, settles disputes among ghosts |

### One curse, two temperaments

Scholars and storytellers rarely treat the names as strict synonyms. The **Brahmarakshasa** emphasises the *rakshasa* half of the equation — demonic strength fused with Vedic recall. The **Brahmadaitya** emphasises the *daitya* or elevated ghost: still uncanny, still obsessed with Sanskrit and shastra, but more likely to smoke a hookah atop a banyan than to devour a trespasser.

Many villagers would say both arise from the same moral failure — a Brahmin who died wrong, or lived wrong — yet **culture shapes the haunting**. A Maharashtrian temple wards a wrathful outer-wall guardian; a Bengali grandmother tells of a Brahmadaitya who rewards honesty with buried treasure. Ishwar Chandra Vidyasagar’s Bangla ghost canon, rooted in the *Betaal Panchabingsati*, sits closer to this eastern register: witty, aristocratic spirits rather than only monsters.

Whether feared or faintly comic, both figures warn the same lesson: **knowledge without humility does not end at the pyre**. The mantra outlives the man, and the village must feed what it cannot exorcise.`,
    protection: 'Never mock ritual or interrupt *yajna*. Temple priests perform specific *Brahmarakshasa puja* where hauntings are documented. Turmeric, neem, and reading of *Garuda Purana* chapters are household safeguards.',
    tags: ['brahmin', 'powerful', 'temple', 'scholar', 'cursed', 'bengali', 'comparative-lore'],
    images: [],
  },
  {
    slug: 'nishi',
    name: 'Nishi',
    alternateNames: ['Nishir Daak', 'Night Caller'],
    region: 'Northeast India',
    gender: 'Variable',
    summary: 'A voice in the night that mimics loved ones — calling victims by name to lure them outside, never to return.',
    appearance: 'Rarely seen; when glimpsed, described as a featureless shadow or a familiar face that melts into darkness. The voice is the true weapon.',
    behavior: 'Calls from beyond doors or windows at night using the exact voice of a friend, parent, or spouse. Victims who answer and open the door vanish. Those who wait until dawn survive.',
    lore: `In Bengali villages, elders instruct children: **never respond to your name after dark** — it may be the Nishi.

The spirit cannot cross a threshold uninvited; it needs the living to open the way. Some stories say it collects voices, adding each victim’s call to its repertoire.

Folklorists link the Nishi to pre-electrification isolation — when a familiar call in darkness was both comfort and possible trap. Ritual *ala* (drawing sacred diagrams) on doorposts persists in some districts.`,
    protection: 'Do not answer to your name at night. Verify callers by asking questions only the real person would know. Keep doors bolted until sunrise; mark thresholds with alta or turmeric.',
    tags: ['voice', 'bengal', 'night', 'lure', 'threshold'],
    images: [],
  },
  {
    slug: 'yakshi',
    name: 'Yakshi',
    alternateNames: ['Yakshini', 'Jakshi'],
    region: 'South India',
    gender: 'Female',
    summary: 'Tree-dwelling spirits of immense beauty tied to ancient fertility cults — benevolent when respected, deadly when provoked.',
    appearance: 'Voluptuous woman in fine ornaments, often seated beneath a palm or ilippa tree. Feet may not touch the ground; some forms show subtle non-human features — reversed eyes or golden skin.',
    behavior: 'Guards sacred trees and hidden treasure. Rewards respectful passersby; kills those who damage her tree or act with lustful intent. Associated with sudden disappearances near groves.',
    lore: `Yakshis appear in early Buddhist and Jain cave art as nature spirits predating modern ghost lore. In Kerala, **Yakshi** stories blend Dravidian tree worship with later Hindu demonology.

The famous Malayalam folktale of the *Yakshi under the palm* warns wayfarers against resting beneath certain trees where resin smells sweet and air grows heavy.

Unlike purely malevolent entities, yakshis maintain a code — harm only those who violate the grove. Villages once planted separate "Yakshi trees" at boundaries to appease them.`,
    protection: 'Never cut or climb a tree suspected of housing a yakshi. Offer flowers and respect boundaries of sacred groves. Iron and chanting of *Ayappa* or *Devi* names are used by those who must pass such places at night.',
    tags: ['tree-spirit', 'kerala', 'fertility', 'nature', 'southern-india'],
    images: [],
  },
];

export async function seedGhosts(): Promise<void> {
  for (const entry of seedEntries) {
    await db
      .insert(ghosts)
      .values(entry)
      .onConflictDoNothing({ target: ghosts.slug });
  }
}

export { seedEntries };
