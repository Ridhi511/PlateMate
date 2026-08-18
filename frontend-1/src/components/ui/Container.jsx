export default function Container({ as: Tag = "div", className = "", children }) {
  return (
    <Tag className={`mx-auto w-full max-w-[1440px] px-6 md:px-8 lg:px-12 xl:px-16 ${className}`}>
      {children}
    </Tag>
  );
}
