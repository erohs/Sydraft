export interface IHandleProps {
  id: string;
  side: string;
  handleMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
