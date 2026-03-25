import { useState } from "react";
import { useTranslation } from "@/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type LegalType = "imprint" | "privacy" | "terms" | null;

interface LegalDialogsProps {
  inline?: boolean;
  renderTrigger?: (openDialog: (type: LegalType) => void) => React.ReactNode;
}

const LegalDialogs = ({ inline, renderTrigger }: LegalDialogsProps = {}) => {
  const { t, locale } = useTranslation();
  const [open, setOpen] = useState<LegalType>(null);

  const close = () => setOpen(null);

  return (
    <>
      {inline && renderTrigger ? (
        renderTrigger(setOpen)
      ) : (
        <div className="flex justify-center gap-6 mt-4">
          <button
            onClick={() => setOpen("imprint")}
            className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.imprint")}
          </button>
          <button
            onClick={() => setOpen("privacy")}
            className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.privacy")}
          </button>
          <button
            onClick={() => setOpen("terms")}
            className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.terms")}
          </button>
        </div>
      )}

      {/* Impressum */}
      <Dialog open={open === "imprint"} onOpenChange={(v) => !v && close()}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t("footer.imprint")}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 text-sm text-muted-foreground">
              {locale === "de" ? (
                <>
                  <h3 className="font-semibold text-foreground">Angaben gemäß § 5 ECG / § 25 MedienG</h3>
                  <p><strong>Firmenname:</strong> celebra.at</p>
                  <p><strong>Unternehmensgegenstand:</strong> Entwicklung und Vertrieb von Software</p>
                  <p><strong>E-Mail:</strong> celebra.at@gmail.com</p>

                  <h3 className="font-semibold text-foreground mt-6">Haftungsausschluss</h3>
                  <p>
                    Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit,
                    Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Haftung für Links</h3>
                  <p>
                    Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
                    Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Urheberrecht</h3>
                  <p>
                    Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                    österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
                    außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des Autors.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-foreground">Legal Information (§ 5 ECG / § 25 MedienG)</h3>
                  <p><strong>Company:</strong> celebra.at</p>
                  <p><strong>Business purpose:</strong> Development and distribution of software</p>
                  <p><strong>Email:</strong> celebra.at@gmail.com</p>

                  <h3 className="font-semibold text-foreground mt-6">Disclaimer</h3>
                  <p>
                    The contents of this website have been created with the utmost care. However, we cannot guarantee
                    the accuracy, completeness, or timeliness of the content.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Liability for Links</h3>
                  <p>
                    Our website contains links to external third-party websites over whose content we have no influence.
                    The respective provider is always responsible for the content of the linked pages.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Copyright</h3>
                  <p>
                    The content and works created by the site operator on these pages are subject to Austrian copyright law.
                    Reproduction, editing, distribution, and any kind of use beyond the limits of copyright law require
                    the written consent of the author.
                  </p>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Datenschutz */}
      <Dialog open={open === "privacy"} onOpenChange={(v) => !v && close()}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t("footer.privacy")}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 text-sm text-muted-foreground">
              {locale === "de" ? (
                <>
                  <h3 className="font-semibold text-foreground">Datenschutzerklärung</h3>
                  <p>
                    Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten
                    daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003).
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Verantwortlicher</h3>
                  <p>celebra.at · celebra.at@gmail.com</p>

                  <h3 className="font-semibold text-foreground mt-6">Erhobene Daten</h3>
                  <p>Bei der Nutzung unserer Website werden folgende Daten verarbeitet:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>E-Mail-Adresse (bei Registrierung)</li>
                    <li>Event-Daten (Titel, Datum, Ort, Beschreibung)</li>
                    <li>Gästelisten und RSVP-Antworten</li>
                    <li>Zahlungsinformationen (über Stripe verarbeitet)</li>
                    <li>Technische Daten (IP-Adresse, Browser, Zugriffszeitpunkt)</li>
                  </ul>

                  <h3 className="font-semibold text-foreground mt-6">Zweck der Datenverarbeitung</h3>
                  <p>
                    Die Daten werden ausschließlich zur Bereitstellung unseres Services (Erstellung und Verwaltung
                    digitaler Event-Einladungen) sowie zur Vertragsabwicklung verwendet.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Speicherdauer</h3>
                  <p>
                    Ihre Daten werden nur solange gespeichert, wie es für die Erfüllung des Vertragszwecks erforderlich
                    ist oder gesetzliche Aufbewahrungsfristen bestehen.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Ihre Rechte</h3>
                  <p>
                    Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
                    Datenübertragbarkeit und Widerspruch. Kontaktieren Sie uns dazu unter celebra.at@gmail.com.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Cookies</h3>
                  <p>
                    Unsere Website verwendet nur technisch notwendige Cookies, die für den Betrieb der Website
                    erforderlich sind. Es werden keine Tracking-Cookies oder Cookies zu Werbezwecken eingesetzt.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Hochgeladene Inhalte</h3>
                  <p>
                    Von Nutzern hochgeladene Inhalte (Bilder, Musik, Videos) werden ausschließlich zum Zweck
                    der Event-Darstellung gespeichert und nach Ablauf der Laufzeit bzw. 30 Tage nach Deaktivierung
                    gelöscht. Eine Weitergabe an Dritte findet nicht statt.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Zahlungsabwicklung</h3>
                  <p>
                    Zahlungen werden über den Zahlungsdienstleister Stripe abgewickelt. Es gelten die
                    Datenschutzbestimmungen von Stripe (stripe.com/privacy).
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-foreground">Privacy Policy</h3>
                  <p>
                    The protection of your personal data is of particular concern to us. We process your data
                    exclusively on the basis of legal provisions (GDPR, TKG 2003).
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Data Controller</h3>
                  <p>celebra.at · celebra.at@gmail.com</p>

                  <h3 className="font-semibold text-foreground mt-6">Data Collected</h3>
                  <p>When using our website, the following data is processed:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Email address (upon registration)</li>
                    <li>Event data (title, date, location, description)</li>
                    <li>Guest lists and RSVP responses</li>
                    <li>Payment information (processed via Stripe)</li>
                    <li>Technical data (IP address, browser, access time)</li>
                  </ul>

                  <h3 className="font-semibold text-foreground mt-6">Purpose of Data Processing</h3>
                  <p>
                    Data is used exclusively to provide our service (creation and management of digital event
                    invitations) and for contract processing.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Storage Duration</h3>
                  <p>
                    Your data is stored only as long as necessary to fulfill the contractual purpose or as required
                    by legal retention periods.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Your Rights</h3>
                  <p>
                    You have the right to access, rectification, deletion, restriction of processing,
                    data portability, and objection. Contact us at celebra.at@gmail.com.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Cookies</h3>
                  <p>
                    Our website uses only technically necessary cookies required for operation.
                    No tracking or advertising cookies are used.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Uploaded Content</h3>
                  <p>
                    Content uploaded by users (images, music, videos) is stored exclusively for the purpose
                    of event presentation and deleted after the runtime expires or 30 days after deactivation.
                    No sharing with third parties takes place.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">Payment Processing</h3>
                  <p>
                    Payments are processed through Stripe. Stripe's privacy policy applies (stripe.com/privacy).
                  </p>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* AGB */}
      <Dialog open={open === "terms"} onOpenChange={(v) => !v && close()}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t("footer.terms")}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 text-sm text-muted-foreground">
              {locale === "de" ? (
                <>
                  <h3 className="font-semibold text-foreground">Allgemeine Geschäftsbedingungen</h3>
                  <p><strong>Stand:</strong> März 2026</p>

                  <h3 className="font-semibold text-foreground mt-6">1. Geltungsbereich</h3>
                  <p>
                    Diese AGB gelten für alle über celebra.at abgeschlossenen Verträge zur Erstellung und
                    Bereitstellung digitaler Event-Einladungen.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">2. Leistungen</h3>
                  <p>
                    celebra.at bietet die Erstellung personalisierter, digitaler Event-Einladungsseiten mit
                    RSVP-Funktion, QR-Code und Gästeverwaltung. Die Event-Seite wird innerhalb von drei
                    Werktagen nach Zahlungseingang bereitgestellt.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">3. Preise & Zahlung</h3>
                  <p>
                    Alle Preise verstehen sich inklusive der gesetzlichen Umsatzsteuer. Die Zahlung erfolgt
                    per Kreditkarte, Apple Pay oder Google Pay über den Zahlungsdienstleister Stripe.
                    Die Zahlung ist vor Bereitstellung der Leistung fällig.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">4. Widerrufsrecht</h3>
                  <p>
                    Als Verbraucher haben Sie das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag
                    zu widerrufen. Das Widerrufsrecht erlischt, wenn die Dienstleistung vollständig erbracht wurde
                    und der Verbraucher dem ausdrücklich zugestimmt hat.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">5. Verfügbarkeit & Laufzeit</h3>
                  <p>
                    Wir bemühen uns um eine hohe Verfügbarkeit unserer Dienste, können jedoch keine 100%ige
                    Verfügbarkeit garantieren. Wartungsarbeiten werden nach Möglichkeit vorab angekündigt.
                  </p>
                  <p>
                    Die initiale Laufzeit jeder Event-Seite beträgt 6 Monate ab Aktivierung. 10 Tage vor Ablauf
                    der Laufzeit werden Sie per Dashboard-Benachrichtigung über die bevorstehende Abschaltung informiert.
                    Eine Verlängerung um weitere 6 Monate ist für €10,00 (inkl. USt.) möglich. Erfolgt keine
                    Verlängerung, wird die Event-Seite nach Ablauf der Laufzeit automatisch deaktiviert.
                    Bereits gespeicherte Daten (Gästelisten, Antworten) bleiben für 30 Tage nach Deaktivierung
                    abrufbar und können als CSV exportiert werden.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">6. Nutzergenerierte Inhalte & Urheberrecht</h3>
                  <p>
                    Der Nutzer ist für alle hochgeladenen Inhalte (Bilder, Musik, Texte) selbst verantwortlich und
                    garantiert, über die erforderlichen Rechte zu verfügen. Insbesondere darf keine urheberrechtlich
                    geschützte Musik ohne entsprechende Lizenz hochgeladen werden. celebra.at behält sich das Recht vor,
                    rechtswidrige Inhalte ohne Vorankündigung zu entfernen. Bei begründetem Urheberrechtsverstoß kann
                    celebra.at den Zugang zur Event-Seite sperren.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">7. Haftung</h3>
                  <p>
                    Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Für leichte Fahrlässigkeit
                    haften wir nur bei Verletzung wesentlicher Vertragspflichten.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">8. Geistiges Eigentum</h3>
                  <p>
                    Die Templates und Designs von celebra.at sind urheberrechtlich geschützt. Mit dem Kauf erhalten
                    Sie ein einfaches Nutzungsrecht für den vereinbarten Zweck.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">9. Anwendbares Recht</h3>
                  <p>
                    Es gilt österreichisches Recht. Gerichtsstand ist das sachlich zuständige Gericht in Österreich.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">10. Kontakt</h3>
                  <p>Bei Fragen wenden Sie sich bitte an: celebra.at@gmail.com</p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-foreground">Terms and Conditions</h3>
                  <p><strong>Last updated:</strong> March 2026</p>

                  <h3 className="font-semibold text-foreground mt-6">1. Scope</h3>
                  <p>
                    These terms apply to all contracts concluded via celebra.at for the creation and provision
                    of digital event invitations.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">2. Services</h3>
                  <p>
                    celebra.at offers the creation of personalized digital event invitation pages with RSVP
                    functionality, QR codes, and guest management. The event page is provided within three
                    business days after payment.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">3. Prices & Payment</h3>
                  <p>
                    All prices include applicable VAT. Payment is made via credit card, Apple Pay, or Google Pay
                    through the payment provider Stripe. Payment is due before the service is provided.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">4. Right of Withdrawal</h3>
                  <p>
                    As a consumer, you have the right to withdraw from this contract within 14 days without giving
                    reasons. The right of withdrawal expires when the service has been fully provided and the
                    consumer has expressly agreed to this.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">5. Availability & Duration</h3>
                  <p>
                    We strive for high availability of our services but cannot guarantee 100% uptime.
                    Maintenance work will be announced in advance where possible.
                  </p>
                  <p>
                    The initial runtime of each event page is 6 months from activation. 10 days before expiration
                    you will be notified via dashboard notification about the upcoming deactivation.
                    An extension of 6 additional months is available for €10.00 (incl. VAT). If no extension
                    is made, the event page will be automatically deactivated after the runtime expires.
                    Already saved data (guest lists, responses) remains accessible for 30 days after
                    deactivation and can be exported as CSV.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">6. User-Generated Content & Copyright</h3>
                  <p>
                    The user is responsible for all uploaded content (images, music, texts) and guarantees
                    having the necessary rights. In particular, no copyrighted music may be uploaded without
                    an appropriate license. celebra.at reserves the right to remove unlawful content without
                    prior notice. In case of substantiated copyright infringement, celebra.at may block
                    access to the event page.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">7. Liability</h3>
                  <p>
                    Liability is limited to intent and gross negligence. We are only liable for slight negligence
                    in case of breach of essential contractual obligations.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">8. Intellectual Property</h3>
                  <p>
                    Templates and designs of celebra.at are protected by copyright. With purchase, you receive
                    a simple right of use for the agreed purpose.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">9. Applicable Law</h3>
                  <p>
                    Austrian law applies. The place of jurisdiction is the competent court in Austria.
                  </p>

                  <h3 className="font-semibold text-foreground mt-6">10. Contact</h3>
                  <p>For questions, please contact: celebra.at@gmail.com</p>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LegalDialogs;
