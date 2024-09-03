import './styles/BackgroundAnimation.styles.scss';

const BackgroundWithAnimation = () => {
  return (
    <div className="background-animation">
      <div className="stars">
        {[...Array(50)].map((_, index) => (
          <div key={index} className="star"></div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundWithAnimation;
