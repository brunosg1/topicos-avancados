package br.edu.utfpr.api.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="tb_pragas")

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString
public class Praga extends BaseEntity {
        
    @NotBlank(message = "Nome da praga é obrigatório")
    @Column(name= "nome", nullable = false, length = 100)
    public String nome;

    @NotBlank(message = "Nome científico é obrigatório")
    @Column(name= "nome_cientifico", nullable = false, length = 100)
    public String nomeCientifico;

    @Size(min = 1, message = "A lista de culturas deve ter pelo menos um item")    @ManyToMany
    @JoinTable(
        name = "praga_cultura",
        joinColumns = @JoinColumn(name = "praga_id"),
        inverseJoinColumns = @JoinColumn(name = "cultura_id"))
    public List<Cultura> culturasAfetadas;

    @NotBlank(message = "Descrição de praga é obrigatório")
    @Column(name= "descricao", nullable = false, length = 100)
    public String descricao;
}
