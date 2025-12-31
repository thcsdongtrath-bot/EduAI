
import { Grade } from './types';

export const CURRICULUM_DATA = {
  [Grade.GRADE_6]: [
    "Unit 1: My New School",
    "Unit 2: My House",
    "Unit 3: My Friends",
    "Unit 4: My Neighbourhood",
    "Unit 5: Natural Wonders of the World",
    "Unit 6: Our Tet Holiday"
  ],
  [Grade.GRADE_7]: [
    "Unit 1: Hobbies",
    "Unit 2: Healthy Living",
    "Unit 3: Community Service",
    "Unit 4: Music and Arts",
    "Unit 5: Food and Drink",
    "Unit 6: A Visit to School"
  ],
  [Grade.GRADE_8]: [
    "Unit 1: Leisure Time",
    "Unit 2: Life in the Countryside",
    "Unit 3: Teenagers",
    "Unit 4: Ethnic Groups of Viet Nam",
    "Unit 5: Our Customs and Traditions",
    "Unit 6: Lifestyles"
  ],
  [Grade.GRADE_9]: [
    "Unit 1: Local Environment",
    "Unit 2: City Life",
    "Unit 3: Teen Stress and Pressure",
    "Unit 4: Life in the Past",
    "Unit 5: Wonders of Viet Nam",
    "Unit 6: Viet Nam: Then and Now"
  ]
};

export const DIFFICULTY_LEVELS = [
  { label: 'Nhận biết', value: 40 },
  { label: 'Thông hiểu', value: 30 },
  { label: 'Vận dụng', value: 20 },
  { label: 'Vận dụng cao', value: 10 }
];
