import React from "react";
import { useAppContext } from "../../context";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../styles";

export default function Form() {
  const [state, setState] = useAppContext();
  const { t } = useTranslation();

  function handleChange(event) {
    const { value } = event.target;
    setState((state) => ({
      ...state,
      email: value,
      emailValid: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
    }));
  }

  function handleChangeName(event) {
    const { value } = event.target;
    setState((state) => ({
      ...state,
      name: value,
    }));
  }

  return (
    <>
      <p style={{ alignSelf: "flex-start", fontSize: "0.9rem" }}>
        {t("wallet.your-email")}: *
      </p>
      <FormInput
        style={{
          borderColor: state.emailValid
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,0,0,0.5)",
        }}
        type="email"
        placeholder={t("wallet.email")}
        value={state.email}
        onChange={handleChange}
      />
      <p style={{ alignSelf: "flex-start", fontSize: "0.9rem" }}>
        {t("wallet.your-name")}:{" "}
      </p>
      <FormInput
        type="email"
        placeholder={t("wallet.your-name")}
        value={state.name}
        onChange={handleChangeName}
      />
    </>
  );
}
