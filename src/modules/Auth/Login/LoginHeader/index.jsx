import logo from "@/app/assets/logo.png";

export default function LoginHeader() {
  return (
    <div className="lg-logo-wrap">
      <div className="lg-logo-img-wrap">
        <img
          src={logo.src}
          alt="Fameo"
          className="lg-logo-img"
        />
      </div>
    </div>
  );
}
