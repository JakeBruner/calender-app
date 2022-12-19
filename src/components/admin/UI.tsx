

// q: how do I make children typesafe?
// a: use React.FC and define the children prop as React.ReactNode

type UIProps = {
  children: React.ReactNode
}

export const UI: React.FC<UIProps> = ({ children }) => {
  

  return (
    <div className="p-5 md:p-10">
      <div className="pb-5">
        <h1 className="font-semibold text-5xl">Admin Panel</h1>
      </div>
      <div className="flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
};

export default UI;