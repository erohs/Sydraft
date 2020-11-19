import React from "react";
import Logo from "../Logo/Logo";
import Handle from "../Handle/Handle";
import { Link } from "react-router-dom";
import { ICoords } from "../../types";
import "./Navigation.css";

interface IMargin {
  [key: string]: number;
}

interface IPosition {
  [key: string]: ICoords;
}

interface INavigationState {
  position: ICoords;
  offset: ICoords;
  side: string;
}

class Navigation extends React.Component {
  state: INavigationState = {
    position: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    side: "left",
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
  }

  handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.setState({
      offset: {
        x: event.pageX - this.state.position.x,
        y: event.pageY - this.state.position.y,
      },
    });

    window.addEventListener("mousemove", this.handleMouseMove, true);
    window.addEventListener("mouseup", this.handleMouseUp, false);
  };

  handleMouseMove = (event: MouseEvent) => {
    const x = event.pageX - this.state.offset.x;
    const y = event.pageY - this.state.offset.y;

    this.setState({
      position: {
        x: x,
        y: y,
      },
    });
  };

  handleMouseUp = (event: MouseEvent) => {
    window.removeEventListener("mousemove", this.handleMouseMove, true);
    window.removeEventListener("mouseup", this.handleMouseUp, false);

    const documentElement = document.documentElement;
    const wrapperHeight = window.innerHeight || documentElement.clientHeight;
    const wrapperWidth = window.innerWidth || documentElement.clientWidth;

    const margin: IMargin = {
      top: event.pageY - 0,
      left: event.pageX - 0,
      bottom: wrapperHeight - event.pageY,
      right: wrapperWidth - event.pageX,
    };

    const position: IPosition = {
      top: { y: 0, x: 0 },
      left: { y: 0, x: 0 },
      bottom: { y: wrapperHeight - 58, x: 0 },
      right: { y: 0, x: wrapperWidth - 58 },
    };

    const sorted = Object.keys(margin).sort((a, b) => margin[a] - margin[b]);
    const nearestSide: string = sorted[0];

    this.setState({ side: nearestSide, position: position[nearestSide] });
  };

  handleResize = () => {
    const documentElement = document.documentElement;
    const wrapperHeight = window.innerHeight || documentElement.clientHeight;
    const wrapperWidth = window.innerWidth || documentElement.clientWidth;

    const position: IPosition = {
      top: { y: 0, x: 0 },
      left: { y: 0, x: 0 },
      bottom: { y: wrapperHeight - 58, x: 0 },
      right: { y: 0, x: wrapperWidth - 58 },
    };

    const nearestSide = position[this.state.side];
    this.setState({ side: nearestSide });
  };

  render() {
    const wrapperClasses = `navigation__wrapper wrapper${this.state.side}`;
    const navClasses = `navigation nav${this.state.side}`;
    const mainClasses = `navigation__main main${this.state.side}`;
    const style = {
      transform: `translate(${this.state.position.x}px, ${this.state.position.y}px)`,
    };
    return (
      <div className={wrapperClasses} style={style} draggable={false}>
        <Handle
          id="navigation__handle"
          side={this.state.side}
          handleMouseDown={this.handleMouseDown}
        />
        <div className={navClasses}>
          <Logo size={30} />
          <div className={mainClasses}>
            <Link to="/">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 612">
                <path d="M447.423 463.989h-82.459l64.34 87.837c6.516 8.897 16.616 13.61 26.86 13.61a33.118 33.118 0 0019.626-6.43c14.82-10.856 18.034-31.667 7.178-46.487l-35.545-48.53zM164.577 463.989l-35.548 48.528c-10.856 14.818-7.642 35.633 7.176 46.485a33.105 33.105 0 0019.628 6.432c10.241 0 20.344-4.715 26.86-13.61l64.342-87.837h-82.459v.002zM595.371 46.564H16.631C7.445 46.564 0 54.009 0 63.197v359.217c0 9.186 7.445 16.629 16.631 16.629h578.741c9.186 0 16.629-7.443 16.629-16.629V63.197c-.001-9.188-7.444-16.633-16.63-16.633zM448.5 367.987a14.797 14.797 0 01-13.669 9.133H115.41c-8.17 0-14.795-6.623-14.795-14.795v-19.843a14.79 14.79 0 014.334-10.462L227 209.97c5.777-5.777 15.146-5.777 20.923 0l86.163 86.163 17.276-17.278c5.777-5.777 15.146-5.777 20.923 0l73.008 73.006a14.802 14.802 0 013.207 16.126zm26.15-163.82c-24.664 0-44.73-20.065-44.73-44.728 0-24.665 20.066-44.732 44.73-44.732 24.664 0 44.73 20.066 44.73 44.732 0 24.663-20.065 44.728-44.73 44.728z" />
              </svg>
            </Link>
            <Link className="navigation-bar--link" to="/gallery">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.25 19.5a3.744 3.744 0 01-3.542-2.551l-.035-.115A3.648 3.648 0 012.5 15.75V8.932L.074 17.03a2.271 2.271 0 001.592 2.755l15.463 4.141c.193.05.386.074.576.074.996 0 1.906-.661 2.161-1.635l.901-2.865zM9 9c1.103 0 2-.897 2-2s-.897-2-2-2-2 .897-2 2 .897 2 2 2z" />
                <path d="M21.5 2h-15A2.503 2.503 0 004 4.5v11C4 16.878 5.122 18 6.5 18h15c1.378 0 2.5-1.122 2.5-2.5v-11C24 3.122 22.878 2 21.5 2zm-15 2h15a.5.5 0 01.5.5v7.099l-3.159-3.686a1.791 1.791 0 00-1.341-.615 1.749 1.749 0 00-1.336.631l-3.714 4.458-1.21-1.207a1.755 1.755 0 00-2.48 0L6 13.939V4.5a.5.5 0 01.5-.5z" />
              </svg>
            </Link>
            <Link className="navigation-bar--link" to="/settings">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M496.659 312.107l-47.061-36.8c.597-5.675 1.109-12.309 1.109-19.328s-.491-13.653-1.109-19.328l47.104-36.821c8.747-6.912 11.136-19.179 5.568-29.397L453.331 85.76c-5.227-9.557-16.683-14.464-28.309-10.176l-55.531 22.293c-10.645-7.68-21.803-14.165-33.344-19.349l-8.448-58.901C326.312 8.448 316.584 0 305.086 0h-98.133c-11.499 0-21.205 8.448-22.571 19.456l-8.469 59.115c-11.179 5.035-22.165 11.435-33.28 19.349l-55.68-22.357c-10.433-4.032-22.913.49-28.097 10.005L9.854 170.347c-5.781 9.771-3.392 22.464 5.547 29.547l47.061 36.8c-.747 7.189-1.109 13.44-1.109 19.307s.363 12.117 1.109 19.328L15.358 312.15c-8.747 6.933-11.115 19.2-5.547 29.397l48.939 84.672c5.227 9.536 16.576 14.485 28.309 10.176l55.531-22.293c10.624 7.659 21.781 14.144 33.323 19.349l8.448 58.88C185.747 503.552 195.454 512 206.974 512h98.133c11.499 0 21.227-8.448 22.592-19.456l8.469-59.093c11.179-5.056 22.144-11.435 33.28-19.371l55.68 22.357a22.924 22.924 0 008.363 1.579c8.277 0 15.893-4.523 19.733-11.563l49.152-85.12c5.462-9.984 3.072-22.25-5.717-29.226zm-240.64 29.226c-47.061 0-85.333-38.272-85.333-85.333s38.272-85.333 85.333-85.333 85.333 38.272 85.333 85.333-38.272 85.333-85.333 85.333z" />
              </svg>
            </Link>
          </div>
          <div className="navigation__add">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.867 477.867">
              <path d="M392.533 0h-307.2C38.228.056.056 38.228 0 85.333v307.2c.056 47.105 38.228 85.277 85.333 85.333h307.2c47.105-.056 85.277-38.228 85.333-85.333v-307.2C477.81 38.228 439.638.056 392.533 0zm-68.266 256H256v68.267c0 9.426-7.641 17.067-17.067 17.067s-17.067-7.641-17.067-17.067V256H153.6c-9.426 0-17.067-7.641-17.067-17.067s7.641-17.067 17.067-17.067h68.267V153.6c0-9.426 7.641-17.067 17.067-17.067S256 144.174 256 153.6v68.267h68.267c9.426 0 17.067 7.641 17.067 17.067S333.692 256 324.267 256z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default Navigation;
