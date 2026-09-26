import { useId } from "react";

/** Small, consistently lit objects that belong to the room's material palette. */
export default function RoomObject({ name }: { name: string }) {
  const id = useId().replace(/:/g, "");
  const ceramic = `url(#${id}-ceramic)`;
  const leaf = `url(#${id}-leaf)`;
  const wood = `url(#${id}-wood)`;
  const plant = /plant|tree|cactus|blossom/i.test(name);
  let object;
  if (plant) {
    const flowers = /blossom|sakura/i.test(name);
    object = (
      <>
        <path
          d="M49 67Q43 41 51 20M49 51 30 34M48 42 68 27"
          stroke="#626b43"
          strokeWidth="3"
          fill="none"
        />
        {/cactus/i.test(name) ? (
          <path
            d="M43 65V24a8 8 0 0 1 16 0v41M43 48H30V33M59 42h12V28"
            stroke="#748663"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <g fill={leaf}>
            <path d="M48 44Q18 46 23 25Q45 24 48 44M51 34Q49 9 70 13Q73 31 51 34M49 56Q64 32 80 44Q72 61 49 56M46 30Q25 19 35 9Q52 12 46 30" />
          </g>
        )}
        {flowers && (
          <g fill="#e5b5b7" stroke="#f4d8d0" strokeWidth="3">
            {[
              [30, 24],
              [65, 18],
              [74, 42],
              [40, 12],
            ].map(([x, y]) => (
              <path
                key={x}
                d={`M${x} ${y - 7}q8-5 8 3q9 1 3 8q-1 8-8 3q-8 4-8-4q-7-6 1-10z`}
              />
            ))}
          </g>
        )}
        <path d="M32 62h37l-5 23q-15 9-27-1z" fill={ceramic} />
        <ellipse cx="50" cy="62" rx="19" ry="5" fill="#cda48a" />
        <ellipse cx="50" cy="62" rx="15" ry="3" fill="#655346" />
      </>
    );
  } else if (/tea/i.test(name))
    object = (
      <>
        <ellipse cx="49" cy="79" rx="34" ry="9" fill="#cebd9f" />
        <ellipse cx="48" cy="76" rx="32" ry="8" fill="#eee2c9" />
        <path
          d="M66 47c24-7 21 27-1 24"
          fill="none"
          stroke="#d3c6aa"
          strokeWidth="7"
        />
        <path d="M24 45h46l-4 26q-19 17-38-1z" fill={ceramic} />
        <ellipse cx="47" cy="45" rx="23" ry="7" fill="#eddfc0" />
        <ellipse cx="47" cy="46" rx="19" ry="4" fill="#809167" />
        <path
          d="M40 32q-8-8 1-17m14 18q8-9 0-18"
          stroke="#fff5e1"
          strokeOpacity=".7"
          strokeWidth="2"
          fill="none"
        />
      </>
    );
  else if (/candle/i.test(name))
    object = (
      <>
        <ellipse cx="50" cy="82" rx="25" ry="6" fill="#90745c" />
        <rect x="32" y="41" width="36" height="40" rx="7" fill={ceramic} />
        <ellipse cx="50" cy="41" rx="18" ry="5" fill="#f3ddad" />
        <path d="M50 42v-9" stroke="#564234" strokeWidth="2" />
        <path d="M50 34Q34 28 51 10Q63 29 50 34" fill="#ffc979" />
        <path d="M50 33q-6-6 1-14q5 10-1 14" fill="#fff5ce" />
      </>
    );
  else if (/lamp/i.test(name))
    object = /moon/i.test(name) ? (
      <>
        <ellipse cx="50" cy="83" rx="22" ry="5" fill={wood} />
        <circle cx="50" cy="47" r="30" fill="#f5deb0" />
        <path
          d="M39 25q-15 15-7 33m28-26 5 4m-14 28 9-3"
          stroke="#d8bf91"
          strokeWidth="3"
          opacity=".5"
          fill="none"
        />
      </>
    ) : (
      <>
        <ellipse cx="49" cy="82" rx="27" ry="7" fill="#7f745c" />
        <path
          d="M49 80V40l17-15"
          stroke="#82745d"
          strokeWidth="5"
          fill="none"
        />
        <path d="m49 23 22-6 13 23-43 10z" fill={ceramic} />
        <path d="m42 49 42-10" stroke="#ffe4a7" strokeWidth="4" />
      </>
    );
  else if (/book/i.test(name))
    object = (
      <>
        {[
          [66, "#879078", 0],
          [52, "#b07f70", 7],
          [38, "#bca779", -2],
        ].map(([y, c, dx]) => (
          <g key={String(y)} transform={`translate(${dx} 0)`}>
            <path d={`M19 ${y}h59v13H19z`} fill={String(c)} />
            <path d={`M25 ${Number(y) + 3}h51v7H25z`} fill="#ecdfc5" />
            <path d={`M19 ${y}l9-5h58l-8 5z`} fill={String(c)} />
          </g>
        ))}
      </>
    );
  else if (/headphone/i.test(name))
    object = (
      <>
        <ellipse cx="50" cy="83" rx="25" ry="6" fill={wood} />
        <path d="M50 81V28M33 30h34" stroke="#977c5b" strokeWidth="5" />
        <path
          d="M26 57V38a24 24 0 0 1 48 0v19"
          stroke="#5b514e"
          strokeWidth="8"
          fill="none"
        />
        <rect x="22" y="44" width="13" height="23" rx="6" fill="#a18279" />
        <rect x="65" y="44" width="13" height="23" rx="6" fill="#a18279" />
      </>
    );
  else if (/music/i.test(name))
    object = (
      <>
        <rect x="13" y="33" width="74" height="48" rx="7" fill={wood} />
        <rect x="20" y="40" width="36" height="33" rx="4" fill="#756b59" />
        {[25, 31, 37, 43, 49].map((x) => (
          <path key={x} d={`M${x} 43v27`} stroke="#b9a689" strokeWidth="2" />
        ))}
        <circle cx="70" cy="61" r="9" fill="#d7c3a0" />
        <path d="M65 34 79 12" stroke="#a4947e" strokeWidth="3" />
        <path d="M62 44h16" stroke="#eee2c9" strokeWidth="3" />
      </>
    );
  else if (/print/i.test(name))
    object = (
      <>
        <path d="M21 15h60v69H21z" fill={wood} />
        <path d="M26 20h49v58H26z" fill="#eadcc6" />
        <circle cx="59" cy="35" r="10" fill="#c79071" />
        <path d="m30 70 17-31 24 31" fill="#8b967e" />
        <path d="m45 70 17-23 9 23" fill="#637969" />
      </>
    );
  else if (/crystal|star/i.test(name))
    object = (
      <>
        <ellipse cx="50" cy="83" rx="25" ry="6" fill={wood} />
        {/star/i.test(name) ? (
          <path
            d="m50 15 10 21 24 4-17 17 4 24-21-11-21 11 4-24-17-17 24-4z"
            fill="#d9bb78"
            stroke="#f1dba6"
            strokeWidth="2"
          />
        ) : (
          <>
            <path d="m50 15 26 25-9 36H33L24 40z" fill="#b0a8bd" />
            <path d="m50 15-9 28 9 33 10-33z" fill="#e0d4e3" />
            <path
              d="M24 40 41 43 33 76M60 43l16-3"
              stroke="#f0dfea"
              fill="none"
            />
          </>
        )}
      </>
    );
  else if (/cushion/i.test(name))
    object = (
      <>
        <path
          d="M20 34q30-16 60 0q-7 24 0 44q-30 12-60 0q5-24 0-44"
          fill="#bc7d79"
          stroke="#dfada1"
          strokeWidth="3"
        />
        <path d="M38 47q12-6 24 0q-3 19-12 24q-10-7-12-24" fill="#d99a8b" />
        <path
          d="m40 44 10 6 11-8"
          stroke="#758064"
          strokeWidth="4"
          fill="none"
        />
      </>
    );
  else if (/golden/i.test(name))
    object = (
      <g fill="#d6b577" stroke="#a48650" strokeWidth="1.5">
        <ellipse cx="49" cy="66" rx="23" ry="23" />
        <path d="M28 31 27 12 42 23M57 23 74 12 72 33" />
        <ellipse cx="50" cy="38" rx="24" ry="20" />
        <path
          d="M67 65q19-5 12-29"
          stroke="#d6b577"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M38 37q4-5 8 0m9 0q4-5 8 0M47 44h6"
          fill="none"
          stroke="#5f4c32"
          strokeWidth="2"
        />
        <path d="M34 57h31" stroke="#ac6757" strokeWidth="5" />
        <ellipse cx="50" cy="71" rx="9" ry="12" fill="#ead18b" />
        <path d="M47 65h6m-3-3v17" stroke="#a88b4e" strokeWidth="2" />
        <ellipse cx="35" cy="85" rx="12" ry="5" />
        <ellipse cx="65" cy="85" rx="12" ry="5" />
      </g>
    );
  else
    object = (
      <g
        fill={/golden/i.test(name) ? "#d6b577" : "#c5a68b"}
        stroke="#9c7e64"
        strokeWidth="1.5"
      >
        <ellipse cx="50" cy="66" rx="23" ry="22" />
        <circle cx="29" cy="26" r="10" />
        <circle cx="70" cy="26" r="10" />
        <ellipse cx="50" cy="38" rx="24" ry="21" />
        <ellipse cx="29" cy="81" rx="12" ry="8" />
        <ellipse cx="71" cy="81" rx="12" ry="8" />
        <g fill="#51433b" stroke="none">
          <circle cx="41" cy="36" r="2.5" />
          <circle cx="59" cy="36" r="2.5" />
          <ellipse cx="50" cy="44" rx="3" ry="2" />
        </g>
        <path d="M44 59h12" stroke="#eee0c3" strokeWidth="5" />
      </g>
    );
  return (
    <svg className="room-object-art" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-ceramic`}>
          <stop stopColor="#f2e3c9" />
          <stop offset=".4" stopColor="#dcccac" />
          <stop offset="1" stopColor="#a48d72" />
        </linearGradient>
        <linearGradient id={`${id}-leaf`} x2="1" y2="1">
          <stop stopColor="#a5b18a" />
          <stop offset="1" stopColor="#526d52" />
        </linearGradient>
        <linearGradient id={`${id}-wood`} x2="0" y2="1">
          <stop stopColor="#c4a47c" />
          <stop offset="1" stopColor="#826449" />
        </linearGradient>
      </defs>
      <ellipse cx="51" cy="87" rx="31" ry="5" fill="#40352a" opacity=".18" />
      {object}
    </svg>
  );
}
