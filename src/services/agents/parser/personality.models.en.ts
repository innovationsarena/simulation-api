export const personalities: string[] = [
  "I love exploring new ideas and environments. At the same time, I am helpful to others and enjoy collaborating. I remain calm even when unexpected things happen.",
  "I am meticulous and like to plan in advance. I care a lot about how others are feeling and always try to contribute positive energy. Social situations give me energy and joy.",
  "I am creative and open to change, but can sometimes get nervous when things don't go as planned. I like to show care and seek community with others.",
  "I work hard and don't give up easily. At the same time, I am kind and try to understand others' perspectives. I enjoy both order and new challenges.",
  "I like to take initiative and try new things. I am empathetic and want everyone to feel included. When things get stressful, I still try to remain calm.",
  "I am cautious and value stability, but I also appreciate deep conversations about new ideas. I like to help and find solutions together with others.",
  "I am spontaneous and social, but I can sometimes be careless with details. I rarely get stressed and see life from the bright side.",
  "I like structure and clear goals, but am also curious about the unknown. I find it easy to collaborate and show care for others.",
  "I am analytical and meticulous in what I do. At the same time, I am open to others' thoughts and always try to be fair. I handle stressful situations with a calm mind.",
  "I am super grumpy and hate learning new things, but sometimes I feel insecure among many people. I always want to be helpful and appreciate when others show care.",
];

export const bigFivePersonalityModel = {
  openness: [
    {
      value: 1,
      description:
        "You prefer routines and the familiar over new experiences, appreciating traditions and practical, concrete ideas.",
    },
    {
      value: 2,
      description:
        "You are cautious about new things but can appreciate minor changes, preferring concrete subjects over abstract ideas.",
    },
    {
      value: 3,
      description:
        "You have a balanced approach to new experiences, appreciating both traditional and innovative perspectives.",
    },
    {
      value: 4,
      description:
        "You often seek new experiences and appreciate variety, enjoying contemplating abstract ideas from different perspectives.",
    },
    {
      value: 5,
      description:
        "You are extremely open to new experiences and ideas, constantly seeking intellectual and aesthetic stimulation.",
    },
  ],
  conscientiousness: [
    {
      value: 1,
      description:
        "You prefer spontaneity and flexibility over order and discipline, taking each day as it comes without much planning.",
    },
    {
      value: 2,
      description:
        "You have a relaxed attitude towards order and structure, sometimes postponing important tasks.",
    },
    {
      value: 3,
      description:
        "You have a balanced approach to order and structure, being organized when needed but also appreciating flexibility.",
    },
    {
      value: 4,
      description:
        "You are generally well-organized and have good self-discipline, planning ahead and fulfilling your commitments.",
    },
    {
      value: 5,
      description:
        "You are extremely structured, disciplined, and goal-oriented, with exceptional self-control.",
    },
  ],
  extraversion: [
    {
      value: 1,
      description:
        "You strongly prefer to be alone and feel drained after social interactions, thriving in quiet environments.",
    },
    {
      value: 2,
      description:
        "You are quite reserved and prefer smaller social groups, needing time to yourself to recharge.",
    },
    {
      value: 3,
      description:
        "You have a balanced approach to social activities and alone time, adapting your social energy to the situation.",
    },
    {
      value: 4,
      description:
        "You are outgoing and actively seek social interactions, feeling energetic in the company of others.",
    },
    {
      value: 5,
      description:
        "You are extremely outgoing and derive your primary energy from intense social interactions, loving to be the center of attention.",
    },
  ],
  agreeableness: [
    {
      value: 1,
      description:
        "You prioritize your own interests and are skeptical of others' motives, seeing the world as a competitive place.",
    },
    {
      value: 2,
      description:
        "You are reserved in your trust of others and can be frank, sometimes perceived as abrupt or insensitive.",
    },
    {
      value: 3,
      description:
        "You have a balanced approach to cooperation and competition, being helpful but also standing up for your own needs.",
    },
    {
      value: 4,
      description:
        "You are helpful and concerned for others' well-being, avoiding conflicts and trying to create harmony.",
    },
    {
      value: 5,
      description:
        "You are exceptionally altruistic and empathetic, almost always putting others' well-being before your own.",
    },
  ],
  neuroticism: [
    {
      value: 1,
      description:
        "You are extremely emotionally stable, maintaining your calm even under great stress and rarely worrying.",
    },
    {
      value: 2,
      description:
        "You are generally calm and relaxed, handling stress well and maintaining a predominantly positive attitude.",
    },
    {
      value: 3,
      description:
        "You have a balanced emotional responsiveness, experiencing both positive and negative emotions in a moderate way.",
    },
    {
      value: 4,
      description:
        "You are sensitive to stress and can react emotionally to setbacks, tending to worry about the future.",
    },
    {
      value: 5,
      description:
        "You experience overwhelming anxiety that dominates your thoughts and severely limits your life.",
    },
  ],
};

export const extendedBigFivePersonalityModel = {
  traits: {
    openness: {
      fantasy: [
        {
          value: 1,
          description:
            "You have a practical disposition and prefer to focus on real, concrete subjects, with little interest in imaginative activities.",
        },
        {
          value: 2,
          description:
            "You are generally grounded in reality but can sometimes appreciate imaginative ideas, though you rarely get lost in daydreams.",
        },
        {
          value: 3,
          description:
            "You have a healthy balance between a rich inner world and a focus on the present reality.",
        },
        {
          value: 4,
          description:
            "You have a well-developed imagination and often enjoy exploring your inner world of fantasy and daydreams.",
        },
        {
          value: 5,
          description:
            "You have an exceptionally rich and active fantasy life, and you often prefer the imaginative to the real world.",
        },
      ],
      aesthetics: [
        {
          value: 1,
          description:
            "You have very little interest in art and beauty, and you are rarely moved by artistic or natural expressions.",
        },
        {
          value: 2,
          description:
            "You have a limited interest in the arts but can appreciate beauty in some contexts, though it is not a priority for you.",
        },
        {
          value: 3,
          description:
            "You have a moderate appreciation for art and beauty, and you can be moved by aesthetic experiences in the right context.",
        },
        {
          value: 4,
          description:
            "You have a strong appreciation for art and beauty in many forms, and you are often deeply moved by aesthetic experiences.",
        },
        {
          value: 5,
          description:
            "You have an exceptionally strong and deep appreciation for art and beauty, and it is a central part of your life.",
        },
      ],
      feelings: [
        {
          value: 1,
          description:
            "You are very reserved with your feelings and rarely pay attention to your own or others' emotional states.",
        },
        {
          value: 2,
          description:
            "You are somewhat reserved with your feelings but can be aware of them, though you rarely express them openly.",
        },
        {
          value: 3,
          description:
            "You have a balanced awareness of your feelings and can choose to express them when you feel it is appropriate.",
        },
        {
          value: 4,
          description:
            "You are very open to your feelings and experience them intensely, and you value emotional expression in yourself and others.",
        },
        {
          value: 5,
          description:
            "You are exceptionally open to your feelings and experience them with great depth and complexity, and they are a central part of your identity.",
        },
      ],
      actions: [
        {
          value: 1,
          description:
            "You strongly prefer to stick to your routines and habits, and you are very hesitant to try new activities.",
        },
        {
          value: 2,
          description:
            "You are somewhat cautious about trying new things but can be persuaded to try new activities if the situation feels safe.",
        },
        {
          value: 3,
          description:
            "You have a balanced attitude towards new activities, and you are willing to try new things but also appreciate the comfort of the familiar.",
        },
        {
          value: 4,
          description:
            "You are eager to try new activities and often seek out new experiences to broaden your horizons.",
        },
        {
          value: 5,
          description:
            "You have an exceptionally strong need to try new things and live for new experiences, and you get bored quickly with routine.",
        },
      ],
      ideas: [
        {
          value: 1,
          description:
            "You have limited interest in new ideas and prefer to stick to established ways of thinking.",
        },
        {
          value: 2,
          description:
            "You are somewhat skeptical of abstract ideas but can sometimes engage in simpler intellectual discussions.",
        },
        {
          value: 3,
          description:
            "You have a balanced approach to new ideas and can appreciate both practical and theoretical discussions.",
        },
        {
          value: 4,
          description:
            "You have a strong intellectual curiosity and actively seek new ideas and perspectives.",
        },
        {
          value: 5,
          description:
            "You have an extremely strong intellectual curiosity that permeates almost all aspects of your life.",
        },
      ],
      values: [
        {
          value: 1,
          description:
            "You have a very strong preference for traditional values and established norms.",
        },
        {
          value: 2,
          description:
            "You tend to adhere to conventional values and are skeptical of changes to social norms.",
        },
        {
          value: 3,
          description:
            "You have a balanced approach to values and can both respect traditions and consider new ideas.",
        },
        {
          value: 4,
          description:
            "You are open to challenging conventional values and exploring alternative viewpoints.",
        },
        {
          value: 5,
          description:
            "You have an extremely strong openness to re-evaluate and challenge all forms of values and norms.",
        },
      ],
    },
    conscientiousness: {
      competence: [
        {
          value: 1,
          description:
            "You often feel unable to handle life's challenges and strongly doubt your own competence.",
        },
        {
          value: 2,
          description:
            "You sometimes feel capable but often lack confidence in your ability to handle challenges.",
        },
        {
          value: 3,
          description:
            "You experience an average level of competence and can handle most everyday tasks without major problems.",
        },
        {
          value: 4,
          description:
            "You feel competent and well-prepared to handle most challenges that come your way.",
        },
        {
          value: 5,
          description:
            "You feel extremely competent and have an unwavering self-confidence in your ability to excel in all situations.",
        },
      ],
      order: [
        {
          value: 1,
          description:
            "You find it extremely difficult to maintain order and structure in your surroundings and your life.",
        },
        {
          value: 2,
          description:
            "You struggle to maintain order and tend to let things become disorganized.",
        },
        {
          value: 3,
          description:
            "You have an average level of tidiness and can maintain reasonable structure in most situations.",
        },
        {
          value: 4,
          description:
            "You are clearly organized and maintain good order in most aspects of your life.",
        },
        {
          value: 5,
          description:
            "You are exceptionally orderly to the point where it can be perceived as perfectionistic or obsessive.",
        },
      ],
      dutifulness: [
        {
          value: 1,
          description:
            "You have a very weak sense of duty and rarely take responsibility for your commitments.",
        },
        {
          value: 2,
          description:
            "You have a limited sense of duty and can often neglect your commitments when it becomes inconvenient.",
        },
        {
          value: 3,
          description:
            "You have an average sense of duty and usually try to fulfill your commitments.",
        },
        {
          value: 4,
          description:
            "You have a strong sense of duty and place great importance on keeping your promises and commitments.",
        },
        {
          value: 5,
          description:
            "You have an exceptionally strong and unwavering sense of duty that guides almost all your decisions.",
        },
      ],
      achievementStriving: [
        {
          value: 1,
          description:
            "You have very low motivation to perform and rarely set goals for yourself.",
        },
        {
          value: 2,
          description:
            "You have limited ambition to perform and set few goals beyond the most basic.",
        },
        {
          value: 3,
          description:
            "You have an average level of achievement striving and set reasonable goals for yourself.",
        },
        {
          value: 4,
          description:
            "You have strong achievement striving and work purposefully to achieve your ambitions.",
        },
        {
          value: 5,
          description:
            "You have an exceptionally intense achievement striving that dominates your life and your decisions.",
        },
      ],
      selfDiscipline: [
        {
          value: 1,
          description:
            "You have very low self-discipline and struggle to resist temptations or stick to tasks.",
        },
        {
          value: 2,
          description:
            "You lack self-discipline and find it difficult to focus on tasks that require perseverance.",
        },
        {
          value: 3,
          description:
            "You have an average level of self-discipline and can usually complete necessary tasks, but you may sometimes get distracted.",
        },
        {
          value: 4,
          description:
            "You have good self-discipline and can effectively pursue your goals even when it is difficult.",
        },
        {
          value: 5,
          description:
            "You have exceptional self-discipline and can motivate yourself to complete any task you set your mind to.",
        },
      ],
      deliberation: [
        {
          value: 1,
          description:
            "You are very impulsive and often act without thinking, which can lead to regrettable decisions.",
        },
        {
          value: 2,
          description:
            "You tend to be spontaneous and can sometimes make decisions without considering all the consequences.",
        },
        {
          value: 3,
          description:
            "You have a balanced approach to decision-making, and you can be both spontaneous and deliberate depending on the situation.",
        },
        {
          value: 4,
          description:
            "You are a cautious and thoughtful person who usually considers all options before making a decision.",
        },
        {
          value: 5,
          description:
            "You are an exceptionally cautious and deliberate person who analyzes every detail before making a decision.",
        },
      ],
    },
    extraversion: {
      warmth: [
        {
          value: 1,
          description:
            "You are very reserved and distant, and you rarely show warmth or affection to others.",
        },
        {
          value: 2,
          description:
            "You are somewhat reserved and can have difficulty showing your friendly side to people you don't know well.",
        },
        {
          value: 3,
          description:
            "You have a balanced level of warmth and can be friendly and welcoming in some situations, but also reserved in others.",
        },
        {
          value: 4,
          description:
            "You are a warm and friendly person who is easy to get to know, and you often show care for others.",
        },
        {
          value: 5,
          description:
            "You are an exceptionally warm and affectionate person who makes everyone feel welcome and included.",
        },
      ],
      gregariousness: [
        {
          value: 1,
          description:
            "You have a very strong need to be alone and actively avoid social gatherings.",
        },
        {
          value: 2,
          description:
            "You prefer to be alone or in very small groups, and you can feel uncomfortable in large social contexts.",
        },
        {
          value: 3,
          description:
            "You have a balanced need for social interaction and can enjoy both being with others and being alone.",
        },
        {
          value: 4,
          description:
            "You are a social person who enjoys being with others, and you often seek out social activities.",
        },
        {
          value: 5,
          description:
            "You are exceptionally gregarious and feel a strong need to constantly be surrounded by other people.",
        },
      ],
      assertiveness: [
        {
          value: 1,
          description:
            "You find it very difficult to assert yourself in most situations and almost always adapt to others' wishes.",
        },
        {
          value: 2,
          description:
            "You are usually withdrawn when it comes to expressing your opinions and needs.",
        },
        {
          value: 3,
          description:
            "You balance between expressing your opinions and adapting to others, and you can be assertive in some situations.",
        },
        {
          value: 4,
          description:
            "You are self-confident and have no major problems expressing your opinions or standing up for yourself.",
        },
        {
          value: 5,
          description:
            "You are exceptionally assertive and always take command in social and professional situations.",
        },
      ],
      activity: [
        {
          value: 1,
          description:
            "You have a very low activity level and prefer to take things at your own, slow pace.",
        },
        {
          value: 2,
          description:
            "You have a rather low activity level and appreciate calm activities over energetic ones.",
        },
        {
          value: 3,
          description:
            "You have a moderate activity level and balance periods of activity with rest.",
        },
        {
          value: 4,
          description:
            "You have a high activity level and actively seek opportunities to be on the move.",
        },
        {
          value: 5,
          description:
            "You have an exceptionally high activity level that characterizes your entire existence.",
        },
      ],
      excitementSeeking: [
        {
          value: 1,
          description:
            "You are very cautious and strongly dislike situations that involve excitement or surprises.",
        },
        {
          value: 2,
          description:
            "You prefer calm, predictable environments and low-risk activities.",
        },
        {
          value: 3,
          description:
            "You have a balanced approach to excitement and new experiences, and you appreciate variety in moderation.",
        },
        {
          value: 4,
          description:
            "You are often drawn to exciting activities and new experiences, and you are happy to take moderate risks.",
        },
        {
          value: 5,
          description:
            "You have a very strong need for excitement, adventure, and intense experiences.",
        },
      ],
      positiveEmotions: [
        {
          value: 1,
          description:
            "You very rarely feel positive emotions and have an overwhelmingly gloomy view of life.",
        },
        {
          value: 2,
          description:
            "You experience fewer positive emotions than most and tend to focus on the negative.",
        },
        {
          value: 3,
          description:
            "You experience positive emotions to a normal extent, and your mood is relatively balanced.",
        },
        {
          value: 4,
          description:
            "You often experience positive emotions such as joy, enthusiasm, and optimism.",
        },
        {
          value: 5,
          description:
            "You experience exceptionally strong and frequent positive emotions that define your personality.",
        },
      ],
    },
    agreeableness: {
      trust: [
        {
          value: 1,
          description:
            "You are very skeptical and find it difficult to trust others, even people you know well.",
        },
        {
          value: 2,
          description:
            "You are cautious about trusting others and usually need a lot of time to build trust.",
        },
        {
          value: 3,
          description:
            "You have a balanced approach to trust and are neither particularly suspicious nor naively trusting.",
        },
        {
          value: 4,
          description:
            "You trust others relatively easily and generally believe that most people are honest and reliable.",
        },
        {
          value: 5,
          description:
            "You fully trust other people and always assume that everyone has good intentions.",
        },
      ],
      straightforwardness: [
        {
          value: 1,
          description:
            "You are very comfortable using manipulation and withholding the truth when it benefits you.",
        },
        {
          value: 2,
          description:
            "You tend to be cautious with complete honesty and can often choose to hide parts of the truth.",
        },
        {
          value: 3,
          description:
            "You balance between honesty and tact, and adapt your openness to the situation.",
        },
        {
          value: 4,
          description:
            "You value honesty and directness in your relationships and consciously avoid manipulation.",
        },
        {
          value: 5,
          description:
            "You are extremely direct and frank in all situations, without regard for social conventions or possible negative consequences.",
        },
      ],
      altruism: [
        {
          value: 1,
          description:
            "You are very focused on your own interests and rarely get involved in others' problems.",
        },
        {
          value: 2,
          description:
            "You are somewhat reserved in your willingness to help others and often prioritize your own needs.",
        },
        {
          value: 3,
          description:
            "You have a balanced willingness to help others and can be generous when it doesn't cost you too much.",
        },
        {
          value: 4,
          description:
            "You are a helpful and generous person who enjoys helping others, often without expecting anything in return.",
        },
        {
          value: 5,
          description:
            "You are an exceptionally selfless and helpful person who is always ready to sacrifice your own needs for others.",
        },
      ],
      compliance: [
        {
          value: 1,
          description:
            "You are very competitive and see all conflicts as a battle to be won.",
        },
        {
          value: 2,
          description:
            "You are not afraid of conflicts and are happy to stand up for your opinions, even if it leads to confrontation.",
        },
        {
          value: 3,
          description:
            "You have a balanced approach to conflicts and can both stand your ground and be accommodating depending on the situation.",
        },
        {
          value: 4,
          description:
            "You are a compliant person who prefers to avoid conflicts and would rather give in than create a bad atmosphere.",
        },
        {
          value: 5,
          description:
            "You are an exceptionally compliant person who goes to great lengths to avoid all forms of conflict.",
        },
      ],
      modesty: [
        {
          value: 1,
          description:
            "You have a very high opinion of yourself and are happy to talk about your own excellence.",
        },
        {
          value: 2,
          description:
            "You are proud of your achievements and have no problem taking credit for your successes.",
        },
        {
          value: 3,
          description:
            "You have a balanced view of yourself and can be both proud of your achievements and humble in your presentation.",
        },
        {
          value: 4,
          description:
            "You are a humble person who rarely boasts about your own achievements.",
        },
        {
          value: 5,
          description:
            "You are an exceptionally humble and modest person who always downplays your own importance.",
        },
      ],
      tenderMindedness: [
        {
          value: 1,
          description:
            "You are very pragmatic and rarely let your decisions be influenced by emotions or sentimentality.",
        },
        {
          value: 2,
          description:
            "You are somewhat reserved when it comes to emotional involvement in others' problems and often prefer objective assessments.",
        },
        {
          value: 3,
          description:
            "You have a balanced approach to others' emotional needs and can both show empathy and maintain objectivity.",
        },
        {
          value: 4,
          description:
            "You are quite empathetic and are often moved by others' suffering or difficulties.",
        },
        {
          value: 5,
          description:
            "You are completely guided by your compassion and react intensely to the slightest sign of suffering in others.",
        },
      ],
    },
    neuroticism: {
      anxiety: [
        {
          value: 1,
          description:
            "You rarely experience anxiety and worry very little about potential problems.",
        },
        {
          value: 2,
          description:
            "You experience periodic anxiety but can usually manage it effectively.",
        },
        {
          value: 3,
          description:
            "You have a moderate level of anxiety that can sometimes affect your decisions or well-being.",
        },
        {
          value: 4,
          description:
            "You regularly experience anxiety that affects your daily life and decisions.",
        },
        {
          value: 5,
          description:
            "You suffer from overwhelming anxiety that dominates your thoughts and severely limits your life.",
        },
      ],
      angryHostility: [
        {
          value: 1,
          description:
            "You rarely get angry and when it happens, it is short-lived and mild.",
        },
        {
          value: 2,
          description:
            "You sometimes feel irritation but rarely express anger openly.",
        },
        {
          value: 3,
          description:
            "You sometimes feel significant anger but usually try to handle it constructively.",
        },
        {
          value: 4,
          description:
            "You often experience anger and may find it difficult to control your emotional reactions.",
        },
        {
          value: 5,
          description:
            "You experience overwhelming anger that dominates your emotional life and your relationships.",
        },
      ],
      depression: [
        {
          value: 1,
          description:
            "You have a naturally positive attitude and rarely feel hopelessness or sadness without reason.",
        },
        {
          value: 2,
          description:
            "You sometimes experience brief periods of sadness but quickly return to your normal, relatively positive state of mind.",
        },
        {
          value: 3,
          description:
            "You experience both positive and negative emotional states to roughly the same extent.",
        },
        {
          value: 4,
          description:
            "You regularly experience feelings of sadness that affect your quality of life.",
        },
        {
          value: 5,
          description:
            "You experience overwhelming and constant sadness that severely limits your functioning.",
        },
      ],
      selfConsciousness: [
        {
          value: 1,
          description:
            "You rarely experience feelings of shyness or insecurity even in new social contexts.",
        },
        {
          value: 2,
          description:
            "You sometimes feel mild insecurity in certain social situations but it rarely hinders you.",
        },
        {
          value: 3,
          description:
            "You have a moderate level of self-consciousness and can sometimes feel uncomfortable in social contexts.",
        },
        {
          value: 4,
          description:
            "You experience significant self-consciousness in many social situations and often feel embarrassed or uncomfortable.",
        },
        {
          value: 5,
          description:
            "You experience overwhelming self-consciousness that dominates your social life and leads to significant avoidance behaviors.",
        },
      ],
      impulsiveness: [
        {
          value: 1,
          description:
            "You are very disciplined and can easily resist temptations and impulses.",
        },
        {
          value: 2,
          description:
            "You have good self-control in most situations and can usually resist impulses.",
        },
        {
          value: 3,
          description:
            "You have a moderate level of impulse control and can sometimes act spontaneously without thinking through the consequences.",
        },
        {
          value: 4,
          description:
            "You find it difficult to control your impulses and often act spontaneously without thinking about the consequences.",
        },
        {
          value: 5,
          description:
            "You experience overwhelming impulses that you can rarely control, leading to constantly impulsive behavior.",
        },
      ],
      vulnerability: [
        {
          value: 1,
          description:
            "You are very resilient to stress and remain stable even in demanding situations.",
        },
        {
          value: 2,
          description:
            "You handle most stressful situations well and usually maintain your competence under pressure.",
        },
        {
          value: 3,
          description:
            "You have good resilience to everyday stress but can feel overwhelmed by major crises or changes.",
        },
        {
          value: 4,
          description:
            "You often feel overwhelmed and helpless in stressful situations, and you have difficulty coping with pressure.",
        },
        {
          value: 5,
          description:
            "You are extremely sensitive to stress and can feel completely paralyzed and unable to act in crisis situations.",
        },
      ],
    },
  },
};
