// Círculo do diagrama da linha. Mostra a foto do símbolo (enviada pelo
// admin) se existir; senão fica vazio (só o círculo).
export default function MachineIcon({ imageSrc, size = 56 }) {
  if (!imageSrc) return null;
  return (
    <img
      src={imageSrc}
      alt=""
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
