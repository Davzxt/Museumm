// ─────────────────────────────────────────────────────────────────────────────
// CONTEÚDO DO MUSEU — edite livremente os textos, destaques e roteiros do grupo.
// Para adicionar vídeos do YouTube em um painel, inclua:
//   video: { youtubeId: 'ID_DO_VIDEO', title: 'Título' }
// ─────────────────────────────────────────────────────────────────────────────

export type RoomId =
  | 'corredor'
  | 'hall'
  | 'origem'
  | 'historia'
  | 'evolucao'
  | 'caracteristicas'
  | 'compositores'
  | 'exemplos'
  | 'curiosidades'
  | 'importancia'
  | 'conclusao';

export interface MotifNote {
  freq: number; // Hz
  time: number; // segundos a partir do início
  dur: number; // duração em segundos
}

export interface PanelData {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  highlights?: string[];
  motif?: { label: string; notes: MotifNote[] };
  video?: { youtubeId: string; title: string };
}

export interface RoomData {
  id: RoomId;
  name: string;
  shortName: string;
  tagline: string;
  accent: string;
  intro: string;
  panels: PanelData[];
  speakerNotes: string[];
}

// Frequências de notas (Hz) para os motivos sintetizados
const N = {
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.0, C3: 130.81, G3: 196.0,
};

export const ROOMS: Record<Exclude<RoomId, 'corredor' | 'hall'>, RoomData> = {
  origem: {
    id: 'origem',
    name: 'Origem',
    shortName: 'Origem',
    tagline: 'De onde vem a música que conta histórias',
    accent: '#ffb454',
    intro:
      'Antes de existir cinema com som, a música já acompanhava as imagens. Nesta sala você descobre como nasceu a ideia de combinar música e narrativa — uma parceria que mudou para sempre a forma de contar histórias.',
    panels: [
      {
        id: 'origem-1',
        title: 'O que é uma trilha sonora?',
        subtitle: 'Definição',
        paragraphs: [
          'Trilha sonora é o conjunto de músicas e sons criados ou escolhidos para acompanhar uma obra audiovisual — um filme, série, jogo, peça de teatro, anime ou até uma propaganda.',
          'Em inglês, o termo é "soundtrack": sound (som) + track (faixa). Originalmente, a palavra designava a faixa física de som gravada na lateral do filme de cinema.',
          'Mais do que "música de fundo", a trilha é uma linguagem: ela informa época, lugar, clima emocional e até pensamentos dos personagens — muitas vezes sem que percebamos.',
        ],
        highlights: ['Sound + track = faixa de som', 'Existe desde antes do cinema falado', 'É uma linguagem narrativa'],
      },
      {
        id: 'origem-2',
        title: 'Antes do som: o cinema mudo',
        subtitle: '1895 – 1920',
        paragraphs: [
          'Quando o cinema nasceu, em 1895, os filmes não tinham som gravado. Mas as sessões nunca foram silenciosas: pianistas, organistas ou orquestras inteiras tocavam ao vivo na sala de exibição.',
          'Os músicos improvisavam ou seguiam catálogos de "música de indicação", que sugeriam temas para perseguições, romances, tempestades e mistérios.',
          'A música tinha também uma função prática: abafar o barulho do projetor e dar ritmo às imagens, ajudando o público a sentir as emoções das cenas.',
        ],
        highlights: ['Pianistas e orquestras ao vivo', 'Música disfarçava o ruído do projetor', 'Catálogos de temas por emoção'],
      },
      {
        id: 'origem-3',
        title: 'A chegada do som ao cinema',
        subtitle: '1926 – 1927',
        paragraphs: [
          'Em 1926, "Don Juan" estreou com música e efeitos sincronizados no sistema Vitaphone. Em 1927, "O Cantor de Jazz" trouxe os primeiros diálogos falados — e o cinema nunca mais foi o mesmo.',
          'A música gravada permitiu que cada cena tivesse exatamente o som planejado pelo compositor, em qualquer cinema do mundo.',
          'Nascia ali a profissão de compositor de trilhas sonoras: artistas que escrevem música sob medida para imagens em movimento.',
        ],
        highlights: ['Don Juan (1926): música sincronizada', 'O Cantor de Jazz (1927): primeiros diálogos', 'Nasce a profissão de compositor de trilhas'],
      },
      {
        id: 'origem-4',
        title: 'Raízes antigas',
        subtitle: 'A música sempre contou histórias',
        paragraphs: [
          'Muito antes do cinema, a ópera, o balé e o teatro já usavam música para dar emoção às cenas. O compositor Richard Wagner, no século XIX, criou o conceito de "leitmotiv": um tema musical associado a um personagem ou ideia.',
          'Essa técnica é usada até hoje: quando ouvimos duas notas descendentes ameaçadoras, sabemos que o tubarão de "Tubarão" (1975) está chegando — mesmo sem vê-lo.',
          'A trilha sonora moderna é, portanto, herdeira de séculos de tradição musical dramática.',
        ],
        highlights: ['Ópera e balé como antepassados', 'Leitmotiv de Wagner', 'Técnica viva até hoje'],
        motif: {
          label: 'Tema do tubarão (inspirado em Jaws)',
          notes: [
            { freq: N.E4, time: 0, dur: 0.32 },
            { freq: N.F4, time: 0.36, dur: 0.32 },
            { freq: N.E4, time: 0.8, dur: 0.32 },
            { freq: N.F4, time: 1.16, dur: 0.32 },
            { freq: N.E4, time: 1.55, dur: 0.28 },
            { freq: N.F4, time: 1.88, dur: 0.28 },
          ],
        },
      },
    ],
    speakerNotes: [
      'Apresentar a definição de trilha sonora com um exemplo conhecido do grupo.',
      'Explicar que no cinema mudo a música era ao vivo — imaginem um pianista na sala!',
      'Destacar 1927 como o marco da virada: O Cantor de Jazz.',
      'Ligar o leitmotiv de Wagner aos temas de personagens atuais (Darth Vader, tubarão).',
    ],
  },

  historia: {
    id: 'historia',
    name: 'História',
    shortName: 'História',
    tagline: 'Uma linha do tempo emocionante',
    accent: '#ff6b6b',
    intro:
      'Dos pianos do cinema mudo às grandes orquestras de Hollywood, do jazz aos sintetizadores: percorra as décadas que transformaram a trilha sonora em arte — e em parte da cultura popular.',
    panels: [
      {
        id: 'historia-1',
        title: 'A Era de Ouro de Hollywood',
        subtitle: 'Anos 1930 – 1950',
        paragraphs: [
          'Com o som sincronizado, os estúdios de Hollywood contrataram compositores europeus que traziam a tradição das óperas e das sinfonias.',
          'Max Steiner, autor da trilha de "King Kong" (1933) e "...E o Vento Levou" (1939), é considerado o "pai" da música de cinema: suas partituras acompanhavam cada gesto e emoção da tela.',
          'Erich Wolfgang Korngold elevou as aventuras de capa e espada a outro nível, com orquestras grandiosas que influenciam John Williams até hoje.',
        ],
        highlights: ['Max Steiner: o pai da trilha', 'Orquestras sinfônicas completas', 'Música colada na ação da cena'],
      },
      {
        id: 'historia-2',
        title: 'Experimentação e novos sons',
        subtitle: 'Anos 1950 – 1970',
        paragraphs: [
          'Bernard Herrmann revolucionou o suspense com Alfred Hitchcock: as cordas estridentes de "Psicose" (1960) provaram que a música podia assustar tanto quanto a imagem.',
          'Ennio Morricone criou para os faroestes de Sergio Leone um som inconfundível: assobios, guitarras, chicotes e vocais inusitados.',
          'O jazz entrou nos filmes noir, e os primeiros instrumentos eletrônicos, como o theremin, deram voz à ficção científica.',
        ],
        highlights: ['Psicose: só cordas, puro terror', 'Morricone e o faroeste spaghetti', 'Theremin: o som do desconhecido'],
      },
      {
        id: 'historia-3',
        title: 'Blockbusters e sintetizadores',
        subtitle: 'Anos 1970 – 1990',
        paragraphs: [
          'John Williams trouxe a grande orquestra de volta com "Tubarão", "Star Wars", "E.T." e "Indiana Jones", criando os temas mais reconhecíveis do planeta.',
          'Ao mesmo tempo, Vangelis ("Blade Runner", "Carruagens de Fogo") e Hans Zimmer mostraram o poder dos sintetizadores, misturando eletrônico e orquestra.',
          'As trilhas passaram a vender milhões de discos: a música de cinema virou sucesso também fora das telas.',
        ],
        highlights: ['Star Wars: a orquestra renasce', 'Vangelis e o eletrônico épico', 'Trilhas nas paradas de sucesso'],
        motif: {
          label: 'Fanfarra heroica (estilo John Williams)',
          notes: [
            { freq: N.C4, time: 0, dur: 0.5 },
            { freq: N.G4, time: 0.55, dur: 0.5 },
            { freq: N.C5, time: 1.1, dur: 0.9 },
            { freq: N.E5, time: 2.05, dur: 0.3 },
            { freq: N.D5, time: 2.4, dur: 0.3 },
            { freq: N.C5, time: 2.75, dur: 1.1 },
          ],
        },
      },
      {
        id: 'historia-4',
        title: 'Trilhas no Brasil',
        subtitle: 'Nossa história musical',
        paragraphs: [
          'No Brasil, o cinema sempre dialogou com a nossa música: das chanchadas musicais dos anos 40 e 50 à trilha de "O Pagador de Promessas" (1962).',
          'Antônio Carlos Jobim compôs para "O Adventurers" e viu "Garota de Ipanema" virar presença constante em filmes do mundo inteiro.',
          'Telenovelas brasileiras também fizeram história: as trilhas das novelas lançavam discos vendidos aos milhões e marcavam época.',
          'Mais recentemente, produções como "Cidade de Deus" (2002) mostraram como a música brasileira dá identidade única às nossas histórias.',
        ],
        highlights: ['Jobim: bossa nova no cinema mundial', 'Trilhas de novela: fenômeno de vendas', 'Cidade de Deus: identidade sonora'],
      },
    ],
    speakerNotes: [
      'Resumir a linha do tempo: mudo → era de ouro → experimentação → blockbuster → digital.',
      'Citarei um compositor por época com um filme que a turma conheça.',
      'Destacar o caso brasileiro: novelas e Cidade de Deus.',
    ],
  },

  evolucao: {
    id: 'evolucao',
    name: 'Evolução',
    shortName: 'Evolução',
    tagline: 'Do papel pautado ao estúdio digital',
    accent: '#4dd0e1',
    intro:
      'A tecnologia transformou a forma de criar música para imagens. Nesta sala, veja como as trilhas evoluíram da orquestra ao sintetizador, do analógico ao digital — e o que isso mudou na arte.',
    panels: [
      {
        id: 'evolucao-1',
        title: 'Da orquestra ao sintetizador',
        subtitle: 'Anos 1970 – 1980',
        paragraphs: [
          'Durante décadas, gravar uma trilha exigia dezenas de músicos tocando juntos, sincronizados com a projeção do filme no estúdio.',
          'Nos anos 70 e 80, os sintetizadores permitiram criar sons totalmente novos com poucos instrumentos — e baratearam a produção.',
          'Filmes como "Halloween" (1978), com seu tema de piano hipnótico composto pelo próprio diretor John Carpenter, provaram que simplicidade também emociona.',
        ],
        highlights: ['Orquestra ao vivo no estúdio', 'Sintetizador: novos timbres', 'Halloween: minimalismo assustador'],
        motif: {
          label: 'Pulso sombrio (estilo John Carpenter)',
          notes: [
            { freq: N.A4, time: 0, dur: 0.16 },
            { freq: N.A4, time: 0.25, dur: 0.16 },
            { freq: N.A4, time: 0.5, dur: 0.16 },
            { freq: N.C5, time: 0.75, dur: 0.4 },
            { freq: N.A4, time: 1.25, dur: 0.16 },
            { freq: N.A4, time: 1.5, dur: 0.16 },
            { freq: N.A4, time: 1.75, dur: 0.16 },
            { freq: N.B4, time: 2.0, dur: 0.4 },
          ],
        },
      },
      {
        id: 'evolucao-2',
        title: 'A revolução digital',
        subtitle: 'Anos 1990 em diante',
        paragraphs: [
          'Com computadores e softwares de áudio (DAWs), um único compositor pode hoje escrever, gravar e mixar uma trilha inteira em casa.',
          'Bibliotecas de samples orquestrais reproduzem violinos, metais e percussão com realismo impressionante, democratizando a criação de trilhas.',
          'A internet aproximou compositores de diretores do mundo todo: hoje uma trilha pode nascer da colaboração entre pessoas que nunca se encontraram pessoalmente.',
        ],
        highlights: ['Estúdio dentro do computador', 'Samples orquestrais realistas', 'Colaboração global à distância'],
      },
      {
        id: 'evolucao-3',
        title: 'Novas mídias, novos desafios',
        subtitle: 'Games e streaming',
        paragraphs: [
          'Nos videogames, a música precisa reagir ao jogador: são trilhas "adaptativas", que mudam de intensidade conforme a ação, criadas em camadas que se combinam em tempo real.',
          'Com o streaming, as trilhas de séries ganharam alcance global — e aberturas como as de "Game of Thrones" e "Stranger Things" viraram fenômenos culturais.',
          'Plataformas de música permitem ouvir a trilha separada do filme: a trilha sonora virou um produto artístico independente.',
        ],
        highlights: ['Games: música adaptativa', 'Aberturas de séries icônicas', 'Trilha como álbum independente'],
      },
      {
        id: 'evolucao-4',
        title: 'Inteligência artificial e o futuro',
        subtitle: 'O que vem por aí',
        paragraphs: [
          'Ferramentas de IA já conseguem gerar música a partir de descrições de texto, e começam a ser usadas como auxílio no processo criativo.',
          'Ao mesmo tempo, cresce o debate sobre autoria, direitos autorais e o valor do toque humano na composição.',
          'Uma coisa é certa: a tecnologia muda o "como", mas o "porquê" permanece — emocionar pessoas por meio da música.',
        ],
        highlights: ['IA como ferramenta de apoio', 'Debate sobre autoria', 'A emoção continua humana'],
      },
    ],
    speakerNotes: [
      'Comparar o esforço de gravar com orquestra e com um notebook hoje.',
      'Explicar música adaptativa com exemplo de jogo conhecido da turma.',
      'Abrir o debate sobre IA: o grupo pode perguntar a opinião da sala.',
    ],
  },

  caracteristicas: {
    id: 'caracteristicas',
    name: 'Características',
    shortName: 'Características',
    tagline: 'A anatomia de uma trilha sonora',
    accent: '#a78bfa',
    intro:
      'O que faz uma trilha funcionar? Aqui você aprende os elementos musicais, as funções narrativas e o passo a passo de como uma trilha sonora é criada para o audiovisual.',
    panels: [
      {
        id: 'carac-1',
        title: 'Funções da música no audiovisual',
        subtitle: 'Para que serve?',
        paragraphs: [
          'Emocionar: a música amplifica alegria, medo, tristeza ou tensão — muitas vezes é ela que nos faz chorar em uma cena.',
          'Situar: instrumentos e estilos indicam época e lugar, como violinos de época em filmes históricos ou taiko em cenas do Japão.',
          'Antecipar: a trilha pode anunciar perigo antes de ele aparecer, criando suspense.',
          'Unificar: temas recorrentes costuram a narrativa e conectam personagens e momentos.',
        ],
        highlights: ['Emocionar', 'Situar no tempo e no espaço', 'Antecipar e criar suspense', 'Unificar a narrativa'],
      },
      {
        id: 'carac-2',
        title: 'Os elementos musicais',
        subtitle: 'Melodia, harmonia, ritmo e timbre',
        paragraphs: [
          'Melodia: a parte "cantável" — o tema que fica na memória, como a abertura de Star Wars.',
          'Harmonia: os acordes que colorem a cena; dissonâncias geram desconforto, consonâncias trazem paz.',
          'Ritmo e andamento: percussões rápidas aceleram o coração nas cenas de ação; compassos lentos dão peso ao drama.',
          'Timbre: a "cor" do som — cordas para emoção, metais para heroísmo, sintetizadores para ficção científica.',
        ],
        highlights: ['Melodia memorável', 'Harmonia = emoção', 'Ritmo = energia', 'Timbre = identidade'],
      },
      {
        id: 'carac-3',
        title: 'Diegética × Não-diegética',
        subtitle: 'A música existe dentro da cena?',
        paragraphs: [
          'Música diegética (ou "source music") é a que os personagens também ouvem: um rádio ligado, uma banda tocando na festa, alguém cantarolando.',
          'Música não-diegética é a trilha que só o público ouve: a orquestra que comenta a cena sem existir dentro dela.',
          'Grandes diretores brincam com essa fronteira: uma canção que começa no rádio do carro pode "crescer" e tomar conta da cena inteira.',
        ],
        highlights: ['Diegética: ouvida pelos personagens', 'Não-diegética: só o público ouve', 'A fronteira pode ser usada com criatividade'],
      },
      {
        id: 'carac-4',
        title: 'Como nasce uma trilha',
        subtitle: 'O processo criativo',
        paragraphs: [
          '1. Spotting: diretor e compositor assistem ao filme juntos e decidem onde entra música — e, igualmente importante, onde ela não entra.',
          '2. Composição: nascem os temas de cada personagem, lugar ou ideia.',
          '3. Orquestração e gravação: os temas ganham instrumentos e são gravados por músicos ou produzidos digitalmente.',
          '4. Mixagem: a música é equilibrada com diálogos e efeitos sonoros na montagem final.',
        ],
        highlights: ['Spotting: onde a música entra', 'Temas para personagens', 'Gravação e mixagem final'],
      },
    ],
    speakerNotes: [
      'Explicar as 4 funções com exemplos de cenas famosas.',
      'Demonstrar diegética × não-diegética com a cena do rádio.',
      'Mostrar o processo de criação como uma receita de 4 passos.',
    ],
  },

  compositores: {
    id: 'compositores',
    name: 'Grandes Compositores',
    shortName: 'Compositores',
    tagline: 'Os mestres por trás das emoções',
    accent: '#fbbf24',
    intro:
      'Conheça os artistas que transformaram notas musicais em memórias coletivas. Cada um tem um estilo inconfundível — e todos mudaram a história do audiovisual.',
    panels: [
      {
        id: 'comp-1',
        title: 'John Williams',
        subtitle: 'O maestro das grandes aventuras',
        paragraphs: [
          'Nascido em 1932, John Williams é o compositor de cinema mais premiado da história, com mais de 50 indicações ao Oscar.',
          'Seus temas sinfônicos definiram a imaginação de gerações: Star Wars, Indiana Jones, Jurassic Park, Harry Potter, E.T., Superman e Tubarão.',
          'Estilo: grandes orquestras, melodias inesquecíveis e leitmotivs para cada personagem — herança direta da Era de Ouro de Hollywood.',
        ],
        highlights: ['5 Oscar e 25 Grammy', 'Mais de 100 trilhas', 'Star Wars: trilha mais vendida da história do cinema'],
        motif: {
          label: 'Fanfarra de aventura (estilo Williams)',
          notes: [
            { freq: N.G4, time: 0, dur: 0.4 },
            { freq: N.C5, time: 0.45, dur: 0.9 },
            { freq: N.G4, time: 1.4, dur: 0.3 },
            { freq: N.A4, time: 1.75, dur: 0.3 },
            { freq: N.B4, time: 2.1, dur: 0.3 },
            { freq: N.C5, time: 2.45, dur: 1.2 },
          ],
        },
      },
      {
        id: 'comp-2',
        title: 'Hans Zimmer',
        subtitle: 'O arquiteto do som moderno',
        paragraphs: [
          'Alemão nascido em 1957, Hans Zimmer mistura orquestra, eletrônico e sons experimentais como ninguém.',
          'É autor das trilhas de O Rei Leão, Gladiador, Piratas do Caribe, Batman: O Cavaleiro das Trevas, Inception, Interestelar e Duna.',
          'Estilo: camadas poderosas, graves impressionantes e o famoso "BRAAAM" que dominou o cinema de ação moderno.',
        ],
        highlights: ['2 Oscar (O Rei Leão, Duna)', 'Pioneiro da trilha híbrida', 'Interestelar: órgão de igreja no espaço'],
        motif: {
          label: 'Pulso épico (estilo Zimmer)',
          notes: [
            { freq: N.C3, time: 0, dur: 0.9 },
            { freq: N.C3, time: 1.0, dur: 0.4 },
            { freq: N.G3, time: 1.5, dur: 0.9 },
            { freq: N.C3, time: 2.5, dur: 0.4 },
            { freq: N.G3, time: 3.0, dur: 0.4 },
            { freq: N.C4, time: 3.5, dur: 1.4 },
          ],
        },
      },
      {
        id: 'comp-3',
        title: 'Ennio Morricone',
        subtitle: 'O poeta do faroeste',
        paragraphs: [
          'Italiano (1928–2020), compôs mais de 500 trilhas ao longo de 70 anos de carreira.',
          'Com o diretor Sergio Leone, criou o som dos faroestes spaghetti: "Três Homens em Conflito", "Era uma Vez no Oeste" e depois "A Missão" e "Os Intocáveis".',
          'Estilo: melodias humanas e doloridas, vozes usadas como instrumento, e sons inusitados — assobios, chicotes, harmônicas.',
        ],
        highlights: ['Oscar honorário (2007) e por Os Oito Odiados (2016)', 'Mais de 500 trilhas', 'A Missão: "Gabriel\'s Oboe" é patrimônio emocional'],
      },
      {
        id: 'comp-4',
        title: 'Joe Hisaishi',
        subtitle: 'A alma dos animes do Studio Ghibli',
        paragraphs: [
          'Japonês nascido em 1950, é o parceiro musical de Hayao Miyazaki há quatro décadas.',
          'Suas trilhas para A Viagem de Chihiro, Meu Amigo Totoro, Princesa Mononoke e O Castelo Animado são sinônimo de delicadeza e encanto.',
          'Estilo: minimalismo, piano lírico e orquestras que flutuam entre a tradição japonesa e a música clássica ocidental.',
        ],
        highlights: ['Parceiro do Studio Ghibli desde 1984', 'Estilo único entre oriente e ocidente', 'Shows com orquestra lotam estádios'],
        motif: {
          label: 'Melodia contemplativa (estilo Hisaishi)',
          notes: [
            { freq: N.E4, time: 0, dur: 0.5 },
            { freq: N.G4, time: 0.55, dur: 0.5 },
            { freq: N.A4, time: 1.1, dur: 0.9 },
            { freq: N.G4, time: 2.05, dur: 0.4 },
            { freq: N.E4, time: 2.5, dur: 0.4 },
            { freq: N.D4, time: 2.95, dur: 1.1 },
          ],
        },
      },
      {
        id: 'comp-5',
        title: 'E muitos outros mestres…',
        subtitle: 'Uma constelação de talentos',
        paragraphs: [
          'Bernard Herrmann (Psicose), o gênio do suspense; Howard Shore (O Senhor dos Anéis), criador de mundos inteiros em música.',
          'Ramin Djawadi (Game of Thrones, Westworld) e Ludwig Göransson (The Mandalorian, Oppenheimer) representam a nova geração.',
          'Hildur Guðnadóttir (Coringa, Chernobyl) abriu espaço para novas vozes e sonoridades experimentais no cinema.',
          'No Brasil, Antônio Carlos Jobim levou a bossa nova para as telas, e nomes como Jaques Morelenbaum seguem compondo para cinema e TV.',
        ],
        highlights: ['Do suspense à fantasia épica', 'Nova geração em destaque', 'Brasil presente'],
      },
    ],
    speakerNotes: [
      'Apresentar cada compositor com um filme que todos conheçam.',
      'Tocar os motivos sintetizados dos painéis e pedir palpites do público.',
      'Perguntar à turma: qual trilha marcou a vida de vocês?',
    ],
  },

  exemplos: {
    id: 'exemplos',
    name: 'Exemplos',
    shortName: 'Exemplos',
    tagline: 'A trilha está em toda parte',
    accent: '#34d399',
    intro:
      'Filmes, jogos, séries, animes, teatro, musicais e até propagandas: explore como a trilha sonora aparece em cada tipo de mídia — sempre com um papel diferente.',
    panels: [
      {
        id: 'ex-1',
        title: 'Cinema',
        subtitle: 'A casa da trilha sonora',
        paragraphs: [
          'No cinema, a trilha é protagonista invisível: Star Wars provou que uma marcha de orquestra pode ser tão famosa quanto os personagens.',
          'Titanic levou "My Heart Will Go On" ao topo das paradas; o filme vendeu mais de 30 milhões de álbuns de trilha.',
          'Interestelar usou um órgão de igreja real para dar dimensão espiritual à viagem pelo espaço.',
        ],
        highlights: ['Star Wars: trilha nº 1 em vendas', 'Titanic: 30 milhões de álbuns', 'Interestelar: órgão de 1926 gravado em igreja'],
      },
      {
        id: 'ex-2',
        title: 'Videogames',
        subtitle: 'Música que reage a você',
        paragraphs: [
          'Nos games, a trilha é interativa: ela muda quando você explora, luta ou vence — como em The Legend of Zelda e Super Mario, cujos temas são patrimônio dos jogadores.',
          'The Last of Us usa violão ronroco para criar melancolia; God of War enche a tela de coros nórdicos; Minecraft embala a exploração com piano minimalista.',
          'Orquestras sinfônicas do mundo todo fazem turnês tocando trilhas de jogos para estádios lotados.',
        ],
        highlights: ['Trilhas adaptativas', 'Zelda e Mario: temas imortais', 'Concertos de games esgotam ingressos'],
      },
      {
        id: 'ex-3',
        title: 'Séries',
        subtitle: 'Aberturas que viram hinos',
        paragraphs: [
          'As séries transformaram aberturas em rituais: os violoncelos de Game of Thrones e os sintetizadores anos 80 de Stranger Things são reconhecidos em segundos.',
          'Breaking Bad usava músicas licenciadas com precisão cirúrgica para comentar a trama.',
          'Round 6 mostrou como uma trilha minimalista pode criar tensão insuportável.',
        ],
        highlights: ['Abertura = identidade da série', 'Músicas licenciadas com significado', 'Minimalismo tenso'],
      },
      {
        id: 'ex-4',
        title: 'Animes',
        subtitle: 'Emoção em cada episódio',
        paragraphs: [
          'Nos animes, a trilha é levada a sério: Yoko Kanno (Cowboy Bebop) misturou jazz, blues e orquestra como ninguém.',
          'As trilhas de Joe Hisaishi para os filmes do Studio Ghibli são apresentadas em concertos no mundo inteiro.',
          'Aberturas (openings) de anime são um fenômeno próprio: viram hits, geram covers e marcam gerações de fãs.',
        ],
        highlights: ['Cowboy Bebop: o jazz espacial', 'Ghibli: concertos mundiais', 'Openings como fenômeno cultural'],
      },
      {
        id: 'ex-5',
        title: 'Teatro e Musicais',
        subtitle: 'Onde tudo começou',
        paragraphs: [
          'No teatro musical, a música é a própria narrativa: O Fantasma da Ópera, O Rei Leão, Hamilton e Les Misérables emocionam plateias há décadas.',
          'Musicais exigem que atores cantem e dancem ao vivo todas as noites — a trilha é interpretada em tempo real.',
          'Muitos musicais migram para o cinema e vice-versa, mostrando a força dessas canções.',
        ],
        highlights: ['Música como narrativa principal', 'Performance ao vivo', 'Palco e cinema em diálogo'],
      },
      {
        id: 'ex-6',
        title: 'Publicidade',
        subtitle: '30 segundos para emocionar',
        paragraphs: [
          'Na publicidade, a música precisa criar emoção instantânea e fixar a marca na memória.',
          'Jingles brasileiros viraram parte da cultura popular — quem nunca cantarolou uma música de comercial?',
          'Marcas pagam fortunas para licenciar canções famosas: a música certa pode dobrar o impacto de uma campanha.',
        ],
        highlights: ['Emoção em segundos', 'Jingles na memória afetiva', 'Licenciamento milionário'],
      },
    ],
    speakerNotes: [
      'Cada integrante apresenta uma mídia (filmes, games, séries, animes, teatro, publicidade).',
      'Pedir exemplos da plateia em cada painel.',
      'Reforçar: em cada mídia, a trilha tem um papel diferente.',
    ],
  },

  curiosidades: {
    id: 'curiosidades',
    name: 'Curiosidades',
    shortName: 'Curiosidades',
    tagline: 'Segredos e histórias incríveis',
    accent: '#f472b6',
    intro:
      'Bastidores surpreendentes, recordes impressionantes e "easter eggs" musicais: esta sala é um mergulho nas histórias mais curiosas do mundo das trilhas sonoras.',
    panels: [
      {
        id: 'curio-1',
        title: 'Recordes impressionantes',
        subtitle: 'Números gigantes',
        paragraphs: [
          'A trilha de Star Wars (1977) é a trilha de cinema mais vendida da história, com mais de 4 milhões de cópias só nos EUA.',
          'John Williams detém o recorde de indicações ao Oscar entre pessoas vivas: mais de 50 nomeações.',
          'A trilha de O Guarda-Costas (1992), com Whitney Houston, é o álbum de trilha mais vendido de todos: mais de 45 milhões de cópias.',
        ],
        highlights: ['Star Wars: nº 1 em trilhas compostas', '50+ indicações ao Oscar', 'O Guarda-Costas: 45 milhões de álbuns'],
      },
      {
        id: 'curio-2',
        title: 'Bastidores surpreendentes',
        subtitle: 'Histórias de estúdio',
        paragraphs: [
          'O tema de Tubarão usa apenas duas notas repetidas. Spielberg achou que era piada quando ouviu pela primeira vez — e depois admitiu: "metade do sucesso do filme é dessa música".',
          'Para Rocky Horror e outros clássicos, músicas foram compostas em poucos dias. Já para Duna (2021), Hans Zimmer criou instrumentos novos para soar "alienígena".',
          'Em Mad Max: Estrada da Fúria, o guitarrista Doof Warrior realmente tocava em cima de um caminhão em movimento — a guitarra soltava fogo de verdade.',
        ],
        highlights: ['Tubarão: só 2 notas', 'Zimmer inventou instrumentos para Duna', 'Guitarra de fogo era real'],
      },
      {
        id: 'curio-3',
        title: 'Easter eggs musicais',
        subtitle: 'Segredos escondidos nas notas',
        paragraphs: [
          'Compositores adoram esconder mensagens: em algumas trilhas, a melodia principal é tocada ao contrário ou em câmera lenta para representar vilões.',
          'Michael Giacchino esconde trocadilhos nos títulos de suas faixas — os nomes das músicas de "Up" e "Os Incríveis" são cheios de piadas.',
          'Em jogos, temas clássicos reaparecem remixados como homenagem: fãs adoram caçar essas referências.',
        ],
        highlights: ['Melodias ao contrário', 'Títulos com trocadilhos', 'Homenagens remixadas'],
      },
      {
        id: 'curio-4',
        title: 'Você sabia?',
        subtitle: 'Curiosidades rápidas',
        paragraphs: [
          'A voz humana é usada como instrumento em muitas trilhas: os coros de O Senhor dos Anéis cantam em línguas inventadas por Tolkien.',
          'O som do sabre de luz de Star Wars foi criado com o zumbido de um projetor de cinema somado à interferência de um microfone na TV.',
          'Estudos mostram que o cérebro libera dopamina ao ouvir música que amamos — por isso uma trilha pode dar arrepios de verdade.',
          'Existe o "teste do tema assobiável": se você consegue assobiar a melodia depois de sair do cinema, o compositor venceu.',
        ],
        highlights: ['Coros em línguas inventadas', 'Sabre de luz = projetor + microfone', 'Música libera dopamina'],
      },
    ],
    speakerNotes: [
      'Interagir com a plateia: "quantas notas tem o tema de Tubarão?"',
      'Contar a história da guitarra de fogo de Mad Max com entusiasmo.',
      'Fazer o teste do tema assobiável com a turma.',
    ],
  },

  importancia: {
    id: 'importancia',
    name: 'Importância Cultural e Social',
    shortName: 'Importância',
    tagline: 'Por que as trilhas importam',
    accent: '#60a5fa',
    intro:
      'As trilhas sonoras atravessam as telas e entram nas nossas vidas: formam memórias, movimentam a economia, aproximam gerações da música clássica e dão identidade a culturas inteiras.',
    panels: [
      {
        id: 'imp-1',
        title: 'Memória afetiva',
        subtitle: 'A trilha da nossa vida',
        paragraphs: [
          'Músicas de filmes, séries e jogos ficam gravadas na memória emocional: basta ouvir os primeiros acordes para revivermos cenas, épocas e pessoas.',
          'Casamentos, formaturas e despedidas usam trilhas porque elas carregam significado compartilhado por milhões de pessoas.',
          'A trilha sonora de uma geração é também o retrato de uma época: os anos 80 soam a sintetizadores, os anos 2000 a orquestras épicas.',
        ],
        highlights: ['Música ativa memórias', 'Rituais de passagem', 'Trilha = retrato de uma época'],
      },
      {
        id: 'imp-2',
        title: 'Ponte para a música clássica',
        subtitle: 'Do cinema ao concerto',
        paragraphs: [
          'Para milhões de jovens, a porta de entrada para a música orquestral não foi Mozart nem Beethoven: foi Star Wars, Harry Potter ou Zelda.',
          'Concertos de trilhas sonoras lotam salas no mundo inteiro, apresentando orquestras a públicos que nunca iriam a uma sinfonia tradicional.',
          'Escolas de música usam temas de filmes e games para motivar estudantes de violino, piano e violoncelo.',
        ],
        highlights: ['Cinema como porta de entrada', 'Concertos de trilhas lotados', 'Temas de filmes nas aulas de música'],
      },
      {
        id: 'imp-3',
        title: 'Indústria e economia criativa',
        subtitle: 'Um mercado gigante',
        paragraphs: [
          'A indústria de trilhas movimenta bilhões: compositores, orquestras, estúdios, cantores, plataformas de streaming e eventos ao vivo.',
          'Uma música licenciada em um filme ou série pode relançar a carreira de um artista — como aconteceu com "Running Up That Hill", de Kate Bush, após Stranger Things.',
          'No Brasil, trilhas de novelas e filmes geraram discos históricos e impulsionaram a música popular.',
        ],
        highlights: ['Bilhões em economia criativa', 'Séries relançam carreiras', 'Trilhas impulsionam artistas'],
      },
      {
        id: 'imp-4',
        title: 'Identidade e diversidade',
        subtitle: 'Muitas vozes, muitas histórias',
        paragraphs: [
          'Trilhas dão visibilidade a culturas: Pantera Negra misturou orquestra com música africana; Viva — A Vida é uma Festa celebra a música mexicana.',
          'Cada vez mais mulheres e compositores de origens diversas ganham espaço, enriquecendo o repertório com novas sonoridades.',
          'A música no audiovisual é também um registro da diversidade humana: cada povo conta sua história com seus sons.',
        ],
        highlights: ['Culturas representadas', 'Novas vozes na composição', 'Diversidade como riqueza artística'],
      },
    ],
    speakerNotes: [
      'Perguntar à plateia: "qual música te faz lembrar de um momento especial?"',
      'Reforçar o papel das trilhas como porta de entrada à música clássica.',
      'Mencionar o caso Kate Bush / Stranger Things como exemplo de impacto cultural.',
    ],
  },

  conclusao: {
    id: 'conclusao',
    name: 'Conclusão',
    shortName: 'Conclusão',
    tagline: 'A última faixa do nosso álbum',
    accent: '#fb7185',
    intro:
      'Chegamos ao fim da visita — mas a trilha continua. Nesta sala final, recapitulamos a jornada e convidamos você a ouvir o mundo com outros ouvidos.',
    panels: [
      {
        id: 'conc-1',
        title: 'O que aprendemos',
        subtitle: 'Resumo da jornada',
        paragraphs: [
          'A trilha sonora nasceu com o cinema, cresceu com as orquestras de Hollywood, reinventou-se com os sintetizadores e hoje vive em todas as telas da nossa vida.',
          'Ela é técnica e emoção ao mesmo tempo: tem funções narrativas claras, mas seu maior poder é invisível — fazer sentir.',
          'Por trás de cada tema existe um compositor, uma equipe e uma história: a trilha é uma das formas de arte mais colaborativas que existem.',
        ],
        highlights: ['Da era muda ao streaming', 'Técnica + emoção', 'Arte colaborativa'],
      },
      {
        id: 'conc-2',
        title: 'A trilha da sua vida',
        subtitle: 'Um convite',
        paragraphs: [
          'A partir de agora, experimente assistir a uma cena sem som — e depois com a trilha. A diferença é a resposta para a pergunta "para que serve a música?".',
          'Preste atenção nos créditos finais: o nome do compositor está lá, esperando ser descoberto.',
          'E se a sua vida fosse um filme, qual seria a trilha sonora? Essa pergunta, agora, você já sabe responder.',
        ],
        highlights: ['Assista sem som. Depois com som.', 'Leia os créditos', 'Qual é a trilha da sua vida?'],
      },
      {
        id: 'conc-3',
        title: 'Agradecimentos',
        subtitle: 'Ficha técnica da exposição',
        paragraphs: [
          'Este museu foi criado como trabalho da disciplina de Artes, para mostrar que apresentações podem ser experiências.',
          'Obrigado pela visita! Explore as salas, ouça os motivos musicais nos painéis e converse com nosso grupo — estamos espalhados pelo museu.',
          'Créditos: conceito, conteúdo e desenvolvimento pelo nosso grupo. Tecnologias: React, Three.js e WebGL.',
        ],
        highlights: ['Trabalho de Artes', 'Explore, ouça e converse', 'Feito com React + Three.js'],
      },
    ],
    speakerNotes: [
      'Recapitular a linha do tempo em 30 segundos.',
      'Fazer o convite: assistam a uma cena muda e depois sonora.',
      'Agradecer a presença e abrir para perguntas.',
    ],
  },
};

export const ROOM_LIST = Object.values(ROOMS);

export const HALL_INFO = {
  title: 'SONORA',
  subtitle: 'Museu Interativo de Trilhas Sonoras',
  description:
    'Bem-vindo ao SONORA. Explore livremente as nove salas ao redor do Hall Principal, interaja com os painéis holográficos e descubra a história da música no audiovisual. Siga a ordem sugerida ou crie o seu próprio caminho.',
};

export const TOTAL_ROOMS = ROOM_LIST.length;
