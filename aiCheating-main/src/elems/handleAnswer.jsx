import { useEffect, useState, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


export default function AnswerBox() {
  const [code, setCode] = useState('solving the question....');
  const [pointers, setPointers] = useState('extracting question.....');
  const heightRef = useRef(null)

  useEffect(() => {
    const handleResponse = async () => {
    const [receivedCode, receivedQuestion] = await window.electronAPI.getAnswer('gemini');
    // setCode(receivedCode.replace(/```[\s\S]*?\n|```/g, '').trim());
    // setPointers(receivedQuestion.replace(/```[\s\S]*?\n|```/g, '').trim());
    // };
    setCode(receivedCode)
    setPointers(receivedQuestion)
    };
    handleResponse()
  }, []);

  useEffect(()=>{
    
    if (heightRef.current) {
      const height = heightRef.current.scrollHeight;
      window.electronAPI.changeHeight(height + 20);
    }
  }, [code, pointers])


  return (
    <div className='body' ref={heightRef}>
      <h3 className='question' style={{
        color: 'white',
        opacity: '0.8',
        margin: '10px',
        fontSize: '20px',
        fontFamily: 'unset'
      }}>{pointers}</h3>
      <SyntaxHighlighter
        language="javascript"
        style={atomDark}
        customStyle={{
          marginRight: '10px',
          marginLeft: '10px',
          display: 'block',
          lineHeight: '1.2',
          maxWidth: '100%',
          overflowX: 'auto',
          overflowY: 'auto',
          padding: '0.5em',
          backgroundColor: 'hsla(0, 0%, 4%, 0.5)',
          borderRadius: '6px',
          fontFamily: 'monospace',
          opacity: 0.6,
          fontSize: '12px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
