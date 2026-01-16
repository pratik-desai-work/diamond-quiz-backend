import './App.css';
import TestQuiz from './components/test-quiz/test_quiz';

function App() {
    return (
        <div className=" min-h-screen flex flex-col items-center justify-center">
            {/* <h1 className='text-4xl font-bold text-blue-800'>Diamond Quiz</h1>
      <button className='ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer'>Let's Start</button> */}
            {/* <Quiz /> */}
            <TestQuiz />
            {/* <DiamondRingSizer /> */}
        </div>
    );
}

export default App;
