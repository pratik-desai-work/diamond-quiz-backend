import SelectQuestion from './select_question';

interface GenericQuestionProps {
    question: any;
    value: any;
    onChange: (value: any) => void;
}

const GenericQuestion: React.FC<GenericQuestionProps> = ({
    question,
    value,
    onChange,
}) => {
    switch (question.type) {
        case 'select':
            return (
                <SelectQuestion
                    question={question}
                    value={value}
                    onChange={onChange}
                />
            );

        case 'budget':
            return (
                <div className="text-center">
                    <p className="mb-4 text-lg">
                        Budget feature coming next 🚀
                    </p>
                </div>
            );

        default:
            return (
                <p className="text-center text-gray-400">
                    Unsupported question type
                </p>
            );
    }
};

export default GenericQuestion;
