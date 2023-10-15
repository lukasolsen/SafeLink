import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

type JSONViewerProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

const JSONViewer: React.FC<JSONViewerProps> = ({ data }) => {
  const jsonAsString = JSON.stringify(data.content, null, 2);

  return (
    <div>
      <SyntaxHighlighter language="json" style={dracula}>
        {jsonAsString}
      </SyntaxHighlighter>
    </div>
  );
};

export default JSONViewer;
