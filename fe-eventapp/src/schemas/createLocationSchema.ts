import { object, string } from "yup";
import { postcodeValidator } from "postcode-validator";
import { EventLocation } from "../types";

const normalizeText = (v:string) => v.trim().toLowerCase();
const normalizePostcode = (v:string) => v.replace(/\s/g, "").toUpperCase();


export const createLocationSchema = (locations: EventLocation[], isPending: boolean) => {
object({
    firstLine: string().trim().required("First line of address is required"),

    city: string().trim().required("City is required"),

    postcode: string()
      .required("Postcode is required")
      .test("is-valid-postcode", "Invalid postcode format", (value) => {
        if (!value) return true; // let required() handle empty
        return postcodeValidator(value.trim().toUpperCase(), "GB");
      })
      .test(
        "is-duplicate",
        "Location already exists. Cannot add it.",
        function (value) {
          const { firstLine, city } = this.parent;

          if (isPending) return true;
          if (!firstLine || !city || !value) return true;

          const normalizedFirstLine = normalizeText(firstLine);
          const normalizedCity = normalizeText(city);
          const normalizedPostcode = normalizePostcode(value);

          return !locations.some((loc) => {
            if (!loc.firstLine || !loc.city || !loc.postcode) return false;

            return (
              normalizeText(loc.firstLine) === normalizedFirstLine &&
              normalizeText(loc.city) === normalizedCity &&
              normalizePostcode(loc.postcode) === normalizedPostcode
            );
          });
        }
      ),
  });

}