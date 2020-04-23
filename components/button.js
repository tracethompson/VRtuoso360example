const Button = ({handleClick, isOpen}) =>
  <div className="search__button" onClick={handleClick}>
    <img src="goggles.png" className="h-auto w-12 mx-auto"/>
    <p className="font-bold mt-2">360 Library</p>
    <style jsx>{`
      .search__button {
        width: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: ${isOpen ? '1px solid black' : 'none'};
        border-radius: 5px;
      }
    `}</style>
  </div>

export default Button