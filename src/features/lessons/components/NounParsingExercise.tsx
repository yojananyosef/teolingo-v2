import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

type ParsingUsage = "atributivo" | "predicado" | "sustantivado";

interface NounParsingValue {
  gender?: "m" | "f";
  number?: "s" | "p" | "d";
  meaning?: string;
  usage?: ParsingUsage;
}

interface NounParsingExerciseProps {
  value: NounParsingValue;
  onChange: (value: NounParsingValue) => void;
  meanings: string[];
  usages?: ParsingUsage[];
  allowDual?: boolean;
  isFinished: boolean;
  correctValue?: NounParsingValue;
  compact?: boolean;
}

export function NounParsingExercise({
  value,
  onChange,
  meanings,
  usages,
  allowDual = true,
  isFinished,
  correctValue,
  compact = false,
}: NounParsingExerciseProps) {
  const isCompact = compact;

  const updateValue = (update: Partial<NounParsingValue>) => {
    if (isFinished) return;
    onChange({ ...value, ...update });
  };

  const isMatched = (field: keyof NounParsingValue, option: string) => value[field] === option;
  const isCorrect = (field: keyof NounParsingValue, option: string) =>
    isFinished && correctValue?.[field] === option;
  const isWrong = (field: keyof NounParsingValue, option: string) =>
    isFinished && value[field] === option && correctValue?.[field] !== option;

  const usageLabelMap: Record<ParsingUsage, string> = {
    atributivo: "Atributivo",
    predicado: "Predicado",
    sustantivado: "Sustantivado",
  };

  const renderChip = (
    field: keyof NounParsingValue,
    option: string,
    label: string,
    chipKey?: string,
  ) => {
    const selected = isMatched(field, option);
    const correct = isCorrect(field, option);
    const wrong = isWrong(field, option);

    return (
      <button
        key={chipKey}
        type="button"
        disabled={isFinished}
        onClick={() => updateValue({ [field]: option })}
        className={cn(
          "relative flex items-center justify-center rounded-xl border-2 font-bold capitalize transition-all",
          isCompact
            ? "px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-[15px] lg:border-b-[3px]"
            : "px-3.5 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-[15px] lg:text-base lg:border-b-4",
          isFinished
            ? correct
              ? "bg-[#D7FFB7] border-[#58CC02] text-[#58A700] z-10"
              : wrong
                ? "bg-[#FFDADC] border-[#FF4B4B] text-[#EA2B2B] opacity-80"
                : "bg-[#F7F7F7] border-[#E5E5E5] text-[#AFAFAF] opacity-50 border-b-2 lg:border-b-2"
            : selected
              ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1899D6] border-b-2 lg:border-b-2 translate-y-[2px]"
              : "bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7] active:border-b-2 active:translate-y-[2px]",
        )}
      >
        {label}
        {isFinished && correct && (
          <CheckCircle2 className="absolute -top-2 -right-2 w-5 h-5 text-[#58CC02] bg-white rounded-full" />
        )}
        {isFinished && wrong && (
          <XCircle className="absolute -top-2 -right-2 w-5 h-5 text-[#FF4B4B] bg-white rounded-full" />
        )}
      </button>
    );
  };

  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto flex flex-col bg-white rounded-3xl border-2 border-[#E5E5E5] shadow-sm",
        isCompact
          ? "gap-3 lg:gap-4 p-3 sm:p-3.5 lg:p-4"
          : "gap-3 sm:gap-4 lg:gap-5 p-3.5 sm:p-4 lg:p-5",
      )}
    >
      {/* Género */}
      <div className={cn("flex flex-col", isCompact ? "gap-2" : "gap-2.5 lg:gap-3")}>
        <h3 className="text-[#AFAFAF] font-black uppercase tracking-widest text-xs lg:text-sm">
          Filtro 1: Género
        </h3>
        <div
          className={cn(
            "grid grid-cols-2",
            isCompact ? "gap-2.5 lg:gap-3" : "gap-2.5 sm:gap-3 lg:gap-4",
          )}
        >
          {renderChip("gender", "m", "Masculino")}
          {renderChip("gender", "f", "Femenino")}
        </div>
      </div>

      <div className="w-full h-px bg-[#E5E5E5]" />

      {/* Número */}
      <div className={cn("flex flex-col", isCompact ? "gap-2" : "gap-2.5 lg:gap-3")}>
        <h3 className="text-[#AFAFAF] font-black uppercase tracking-widest text-xs lg:text-sm">
          Filtro 2: Número
        </h3>
        <div
          className={cn(
            "grid",
            allowDual ? "grid-cols-3" : "grid-cols-2",
            isCompact ? "gap-2.5 lg:gap-3" : "gap-2.5 sm:gap-3 lg:gap-4",
          )}
        >
          {renderChip("number", "s", "Singular")}
          {renderChip("number", "p", "Plural")}
          {allowDual && renderChip("number", "d", "Dual")}
        </div>
      </div>

      <div className="w-full h-px bg-[#E5E5E5]" />

      {/* Significado */}
      <div className={cn("flex flex-col", isCompact ? "gap-2" : "gap-2.5 lg:gap-3")}>
        <h3 className="text-[#AFAFAF] font-black uppercase tracking-widest text-xs lg:text-sm">
          Filtro 3: Significado
        </h3>
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2",
            isCompact ? "gap-2.5 lg:gap-3" : "gap-2.5 sm:gap-3 lg:gap-4",
          )}
        >
          {meanings.map((meaning, index) =>
            renderChip("meaning", meaning, meaning, `meaning-${meaning}-${index}`),
          )}
        </div>
      </div>

      {usages && usages.length > 0 && (
        <>
          <div className="w-full h-px bg-[#E5E5E5]" />

          <div className={cn("flex flex-col", isCompact ? "gap-2" : "gap-2.5 lg:gap-3")}>
            <h3 className="text-[#AFAFAF] font-black uppercase tracking-widest text-xs lg:text-sm">
              Filtro 4: Uso Adjetival
            </h3>
            <div
              className={cn(
                "grid grid-cols-1 sm:grid-cols-3",
                isCompact ? "gap-2.5 lg:gap-3" : "gap-2.5 sm:gap-3 lg:gap-4",
              )}
            >
              {usages.map((usage) =>
                renderChip("usage", usage, usageLabelMap[usage], `usage-${usage}`),
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
