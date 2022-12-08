import CountValue from '../components/demo/CountValue';
import FancyInput from '../components/demo/FancyInput';
import MainContent from '../components/Pages/MainContent'
import ArticleDetail from '../components/Pages/articleDetail'
import SleepPage from '../components/Pages/SleepPage'
import StudyPage from '../components/Pages/StudyPage'
import ExercisePage from '../components/Pages/ExercisePage'
import TodoPage from '../components/Pages/TodoPage'
 
const router = [
    {path: '/', components: MainContent},
    {path: '/value', components: CountValue},
    {path: '/input', components: FancyInput},
    {path: '/articleDetail', components: ArticleDetail},
    {path: '/sleep', components: SleepPage},
    {path: '/study', components: StudyPage},
    {path: '/exercise', components: ExercisePage},
    {path: '/todo', components: TodoPage}
]

export default router;