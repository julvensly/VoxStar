import pool from '../config/database.js'

async function uploadToUploadcare(file) {
  const publicKey = process.env.UPLOADCARE_PUBLIC_KEY

  if (!publicKey) {
    throw new Error('UPLOADCARE_PUBLIC_KEY pa konfigire.')
  }

  const form = new FormData()

  form.append('UPLOADCARE_PUB_KEY', publicKey)
  form.append('UPLOADCARE_STORE', '1')

  const blob = new Blob(
    [file.buffer],
    { type: file.mimetype }
  )

  form.append('file', blob, file.originalname)

  const response = await fetch(
    'https://upload.uploadcare.com/base/',
    {
      method: 'POST',
      body: form
    }
  )

  const data = await response.json()

  if (!response.ok || !data.file) {
    console.error('Uploadcare upload error:', data)

    throw new Error('Upload foto sou Uploadcare echwe.')
  }

  return `https://47z9ktu6of.ucarecd.net/${data.file}/`
}

export async function createConcours(req, res) {
  try {
    const {
      nom,
      prix,
      places,
      inscriptionDebut,
      inscriptionFin,
      premierDebut,
      premierFin,
      premierNombre,
      deuxiemeDebut,
      deuxiemeFin,
      deuxiemeNombre,
      troisiemeDebut,
      troisiemeFin
    } = req.body

    if (
      !nom ||
      prix === undefined ||
      !places ||
      !inscriptionDebut ||
      !inscriptionFin ||
      !premierDebut ||
      !premierFin ||
      !premierNombre ||
      !deuxiemeDebut ||
      !deuxiemeFin ||
      !deuxiemeNombre ||
      !troisiemeDebut ||
      !troisiemeFin
    ) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires sont requis.'
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "L'affiche du concours est obligatoire."
      })
    }

    const createdBy = req.user?.id ?? req.user?.userId

    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non identifié.'
      })
    }

    const photoUrl = await uploadToUploadcare(req.file)

    const result = await pool.query(
      `
      INSERT INTO public.concours (
        name,
        photo_url,
        status,
        created_by,
        prix,
        places,
        inscription_debut,
        inscription_fin,
        premier_debut,
        premier_fin,
        premier_nombre,
        deuxieme_debut,
        deuxieme_fin,
        deuxieme_nombre,
        troisieme_debut,
        troisieme_fin
      )
      VALUES (
        $1,
        $2,
        'draft',
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15
      )
      RETURNING *
      `,
      [
        nom,
        photoUrl,
        createdBy,
        Number(prix),
        Number(places),
        inscriptionDebut,
        inscriptionFin,
        premierDebut,
        premierFin,
        Number(premierNombre),
        deuxiemeDebut,
        deuxiemeFin,
        Number(deuxiemeNombre),
        troisiemeDebut,
        troisiemeFin
      ]
    )

    return res.status(201).json({
      success: true,
      message: 'Concours créé avec succès.',
      concours: result.rows[0]
    })
  } catch (error) {
    console.error('Erreur création concours:', error)

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du concours.'
    })
  }
}
