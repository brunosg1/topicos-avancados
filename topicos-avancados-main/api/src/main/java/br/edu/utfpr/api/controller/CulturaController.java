package br.edu.utfpr.api.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.dto.CulturaDTO;
import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.repository.CulturaRepository;
import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping(value = "/culturas", produces = "application/json")
public class CulturaController {

    @Autowired
    private CulturaRepository culturaRepository;

    @GetMapping({ "", "/" })
    public ResponseEntity<List<Cultura>> getAll() {
        // Se não houver ID, retorna todas as culturas
        List<Cultura> culturas = culturaRepository.findAll();
        return ResponseEntity.ok(culturas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Cultura>> getById(@PathVariable Long id) {
        // Se houver ID, retorna a cultura específica
        List<Cultura> culturas = culturaRepository.findById(id)
                .map(cultura -> List.of(cultura)) // Cria uma lista com a cultura encontrada
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada"));

        return ResponseEntity.ok(culturas);
    }

    @PostMapping({ "", "/" })
    public ResponseEntity<Cultura> post(@Valid @RequestBody CulturaDTO p, BindingResult bindingResult) {
        System.out.println("CulturaDTO recebido: " + p.nome);
        var cultura = new Cultura();
        cultura.setNome(p.nome);
        cultura.setTempoCultivoDias(p.tempoCultivoDias);
        cultura.setEpocaPlantio(p.epocaPlantio);
        cultura.setCreationDate(LocalDateTime.now());

        Cultura salva = culturaRepository.save(cultura);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping({ "", "/" })
    public ResponseEntity<Cultura> put(@RequestBody @Valid Cultura cultura) {
        Cultura existente = culturaRepository.findById(cultura.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada"));

        existente.setNome(cultura.getNome());
        existente.setTempoCultivoDias(cultura.getTempoCultivoDias());
        existente.setEpocaPlantio(cultura.getEpocaPlantio());
        existente.setUpdateDate(LocalDateTime.now());

        Cultura atualizada = culturaRepository.save(existente);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable @Valid long id) {
        Cultura cultura = culturaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada"));

        culturaRepository.delete(cultura);

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("status", 200);
        resposta.put("mensagem", "Cultura deletada com sucesso");

        return ResponseEntity.ok(resposta);
    }
}
