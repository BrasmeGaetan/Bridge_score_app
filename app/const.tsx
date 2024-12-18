

export const INITIAL_PICKER_POSITION = { x: 0, y: 0 }
export const ANIMATION_DURATION = 1000
export const SWIPE_VALUE = 50

export const MESSAGES = [
  { "name": "level", "message": "Select a level :" },
  { "name": "trump", "message": "Select a trump suit :" },
  { "name": "declaring", "message": "Select the declarer :" },
  { "name": "vulnerability", "message": "Select a vulnerability :" },
  { "name": "doubled", "message": "Select a possible double :" },
  { "name": "tricks", "message": "Select a number of tricks :" }
]

export const ANIMATIONS = [
      { "name": "level", "final_position": { "x": -190, "y": -370 }, "duration": ANIMATION_DURATION },
      { "name": "trump", "final_position": { "x": -110, "y": -370 }, "duration": ANIMATION_DURATION },
      { "name": "vulnerability", "final_position": { "x": -30, "y": -370 }, "duration": ANIMATION_DURATION },
      { "name": "doubled", "final_position": { "x": 50, "y": -370 }, "duration": ANIMATION_DURATION },
      { "name": "tricks", "final_position": { "x": 130, "y": -370 }, "duration": ANIMATION_DURATION }
    ]
    export const PARAMETERS_VALUE = {
        level: [1, 2, 3, 4, 5, 6, 7],
        trump: [
            { label: '♠', value: 'spade', icon: 'spade_trump' },
            { label: '♥', value: 'heart', icon: 'heart_trump' },
            { label: '♦', value: 'diamond', icon: 'diamond_trump' },
            { label: '♣', value: 'club', icon: 'club_trump' },
            { label: 'SA', value: 'SA', icon: 'no_trump' }
          ],
        declaring: [{ label: "S", value: 0 },
         { label: "N", value: 1 },
         { label: "E", value: 2 }, 
         { label: "W", value: 3 }
        ],
        vulnerability: [{ label: "N/S", value: 3 }, { label: "E/W", value: 1 }, { label: "Love", value: 0 }, { label: "All", value: 4 }],
        doubled: [{ label: 'Non contré', value: 0 }, 
        { label: 'X', value: 1,  icon: 'doubled1_user'}, 
        { label: 'XX', value: 2, icon: 'doubled2_user'  }
      ],
        tricks: ['+6', '+5', '+4', '+3', '+2', '+1', '0', '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10', '-11', '-12', '-13']
    };

    export const getSvgName = (level, trump) => {
      const svgName = `${level}_${trump}`;
      return svgName;
    };

    export const getDoubledSvg = (doubled) => {
      if (doubled === 1) {
        return 'mini_doubled1_user';
      } else if (doubled === 2) {
        return 'mini_doubled2_user';
      }
      return ''; 
    };
    