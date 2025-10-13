import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ConsultasCarousel({ consultas }) {
  if (!consultas?.length) return null;

  const styles = {
    container: "mt-4",
    title: "text-lg font-semibold text-gray-100 mb-2",
    slide: "flex flex-col items-center p-2",
    img: "rounded shadow-md",
    date: "mt-2 text-gray-300",
  };

  const settings = { dots: true, infinite: false, speed: 500, slidesToShow: 1, slidesToScroll: 1 };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Evolución del tratamiento</h3>
      <Slider {...settings}>
        {consultas.map((c, idx) => (
          <div key={idx} className={styles.slide}>
            {c.imagen && <img src={c.imagen} alt={`Consulta ${c.id}`} className={styles.img} />}
            <p className={styles.date}>{c.fecha}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}
